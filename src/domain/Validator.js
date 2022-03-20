const InvalidBarCodeError = require('./exceptions/InvalidBarCodeError');
const InvalidDigitableLineError = require('./exceptions/InvalidDigitableLineError');
const InvalidBlockError = require('./exceptions/InvalidBlockError');
const InvalidReferenceIdentifierError = require('./exceptions/InvalidReferenceIdentifierError');
const BankBondsBoleto = require('./models/BankBondsBoleto');

module.exports = class Validator {
    constructor(boleto) {
        this.boleto = boleto;
    }

    validateDigitableLine() {
        const digitableLine = this.boleto.getDigitableLine();

        if(isNaN(digitableLine)) throw new InvalidDigitableLineError(digitableLine);
    }

    sumDigits(number) {
        const sum = String(number)
            .split('')
            .map(i => +i)
            .reduce((accum, curr) => accum += curr, 0);

        return sum;
    }

    validateModule10(blocks, blocksVerifyingDigits) {
        blocks.forEach((block) => {
            // TODO: remove code duplication
            const sum = block.split('')
                .reverse()
                .map(i => +i)
                .reduce((accum, curr, i) => {
                    const multiplier = i % 2 === 0 ? 2 : 1;
                    const product = curr * multiplier;

                    if (product > 9) {
                        const digitsSum = this.sumDigits(product);

                        return accum += digitsSum;
                    };

                    return accum += product;
                }, 0);

            const rest = sum % 10;

            let verifyingDigit = sum - rest + 10 - sum;
            verifyingDigit = verifyingDigit !== 10 ? verifyingDigit : 0;

            const expectVerifyingDigit = blocksVerifyingDigits.shift();

            const isBlockValid = String(verifyingDigit) === expectVerifyingDigit;

            if (!isBlockValid) throw new InvalidBlockError(block);
        });
    }

    validateDACModule10(barCode, barCodeVerifyingDigit) {
        // TODO: remove code duplication
        const sum = barCode.split('')
            .reverse()
            .map(i => +i)
            .reduce((accum, curr, i) => {
                const multiplier = i % 2 === 0 ? 2 : 1;
                const product = curr * multiplier;

                if (product > 9) {
                    const digitsSum = this.sumDigits(product);

                    return accum += digitsSum;
                };

                return accum += product;
            }, 0);

        const rest = sum % 10;
        const verifyingDigit = 10 - rest;

        if (verifyingDigit !== +barCodeVerifyingDigit) throw new InvalidBarCodeError(barCode);
    }

    validateModule11(barCode, barCodeVerifyingDigit) {
        // TODO: remove code duplication
        const sum = barCode.split('')
            .reverse()
            .map(i => +i)
            .reduce((accum, curr, i) => {
                const multiplier = i % 8 + 2 ;

                const product = curr * multiplier;

                return accum += product;
            }, 0);

        const rest = sum % 11;
        const diff = 11 - rest;
        const verifyingDigit = [0, 10, 11].includes(diff) ? 1 : diff;

        const isValidBarCode = verifyingDigit === +barCodeVerifyingDigit;

        if (!isValidBarCode) throw new InvalidBarCodeError(barCode); 
    }

    validateDACModule11(barCode, barCodeVerifyingDigit) {
        // TODO: remove code duplication
        const sum = barCode.split('')
            .reverse()
            .map(i => +i)
            .reduce((accum, curr, i) => {
                const multiplier = i % 8 + 2 ;

                const product = curr * multiplier;

                return accum += product;
            }, 0);

        const rest = sum % 11;
        const verifyingDigit = ((rest) => {
            if ([0, 1].includes(rest)) return 0;
            else if (rest === 10) return 1;
            else return rest;
        })(rest);

        const isValidBarCode = verifyingDigit === +barCodeVerifyingDigit;

        if (!isValidBarCode) throw new InvalidBarCodeError(barCode); 
    }

    validateBlocks() {
        const blocks = this.boleto.extractBlocks();
        const blocksVerifyingDigits = this.boleto.extractBlocksVerifyingDigits();

        this.validateModule10(blocks, blocksVerifyingDigits);
    }

    validateBarCode() {
        if(this.boleto instanceof BankBondsBoleto) {
            const barCode = this.boleto.extractBarCodeWithoutVerifyingDigit();
            const barCodeVerifyingDigit = this.boleto.extractBarCodeVerifyingDigit();

            this.validateModule11(barCode, barCodeVerifyingDigit);
        } else {
            const barCode = this.boleto.extractBarCodeWithoutVerifyingDigit();
            const barCodeVerifyingDigit = this.boleto.extractBarCodeVerifyingDigit();
            const referenceIdentifier = this.boleto.extractReferenceIdentifier();

            const verifyDACModule10 = [6, 7].includes(+referenceIdentifier);
            const verifyDACModule11 = [8, 9].includes(+referenceIdentifier);

            if(verifyDACModule10) this.validateDACModule10(barCode, barCodeVerifyingDigit);
            else if (verifyDACModule11) this.validateDACModule11(barCode, barCodeVerifyingDigit);
            else throw new InvalidReferenceIdentifierError(referenceIdentifier);
        }
    }

    validateBoleto() {
        this.validateDigitableLine();
        this.validateBlocks();
        this.validateBarCode();
    }
}

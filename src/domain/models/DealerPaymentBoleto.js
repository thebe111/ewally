const Boleto = require('./../../core/ports/Boleto');

module.exports = class DealerPaymentBoleto extends Boleto {
    constructor(digitableLine) {
        super(digitableLine);
    }

    extractBlocks() {
        const blocks = [
            this.digitableLine.substring(0, 11),
            this.digitableLine.substring(12, 23),
            this.digitableLine.substring(24, 35),
            this.digitableLine.substring(36, 47),
        ];

        return blocks;
    }

    extractBlocksVerifyingDigits() {
        const blocksVerifyingDigits = [
            this.digitableLine.substring(11, 12),
            this.digitableLine.substring(23, 24),
            this.digitableLine.substring(35, 36),
            this.digitableLine.substring(47, 48),
        ];

        return blocksVerifyingDigits;
    }

    extractExpirationFactor() {}

    // TODO: how to know that the date is present on 24 index position?
    extractExpirationDate() {}

    // TODO: referenceIdentifier === 7 or 9 need to be adjusts by an indice,
    // where's the specs for this?
    extractAmount() {
        const amount = this.digitableLine.substring(4, 15);

        return amount;
    }

    extractBarCodeVerifyingDigit() {
        const barCodeVerifyingDigit = this.digitableLine.substring(3, 4);

        return barCodeVerifyingDigit;
    }

    extractBarCodeWithoutVerifyingDigit() {
        const blocks = this.extractBlocks().join('');

        const barCode = blocks.slice(0, 3).concat(blocks.slice(4));

        return barCode;
    }

    extractBarCode() {
        const barCode = this.extractBlocks().join('');

        return barCode;
    }

    extractReferenceIdentifier() {
        const referenceIdentifier = this.getDigitableLine().substring(2, 3);

        return referenceIdentifier;
    }
}

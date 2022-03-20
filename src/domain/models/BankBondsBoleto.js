const Formatter = require('./../../core/Formatter');
const Boleto = require('./../../core/ports/Boleto');

module.exports = class BankBondsBoleto extends Boleto {
    constructor(digitableLine) {
        super(digitableLine);
    }

    extractBlocks() {
        const blocks = [
            this.digitableLine.substring(0, 9),
            this.digitableLine.substring(10, 20),
            this.digitableLine.substring(21, 31),
        ];

        return blocks;
    }

    extractBlocksVerifyingDigits() {
        const verifyingDigits = [
            this.digitableLine.substring(9, 10),
            this.digitableLine.substring(20, 21),
            this.digitableLine.substring(31, 32),
        ];

        return verifyingDigits;
    }

    extractExpirationFactor() {
        const expirationFactor = this.digitableLine.substring(33, 37);

        return expirationFactor;
    }

    // TODO: how to know that expiration date is not present in digitable line
    // when the amount it's a value of 14 bits
    extractExpirationDate() {
        const baseDate = new Date('1997-10-07 00:00:00');
        const expirationFactor = this.extractExpirationFactor();
        const date = baseDate.setDate(baseDate.getDate() + parseInt(expirationFactor));
        const expirationDate = Formatter.formatDate(new Date(date));

        return expirationDate;
    }

    extractAmount() {
        const amount = this.digitableLine.substring(37);

        return amount;
    }

    extractBarCodeVerifyingDigit() {
        const barCodeVerifyingDigit = this.digitableLine.substring(32, 33);

        return barCodeVerifyingDigit;
    }

    extractBarCodeWithoutVerifyingDigit() {
        const barCode = this.digitableLine.substring(0, 4)
            .concat(this.extractExpirationFactor())
            .concat(this.extractAmount())
            .concat(this.extractBlocks().join('').substring(4));

        return barCode;
    }

    extractBarCode() {
        const barCode = this.extractBarCodeWithoutVerifyingDigit()
            .replace(/^([0-9]{3})/, `$1${this.extractBarCodeVerifyingDigit()}`)

        return barCode;
    }

    extractReferenceIdentifier() {}
}

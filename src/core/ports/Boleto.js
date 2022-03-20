module.exports = class Boleto {
    constructor(digitableLine) {
        this.digitableLine = digitableLine;
    }

    getDigitableLine() {
        return this.digitableLine;
    }
}

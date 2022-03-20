const DealerPaymentBoleto = require('./../domain//models/DealerPaymentBoleto');
const BankBondsBoleto = require('./../domain/models/BankBondsBoleto');

module.exports = class Identifier {
    constructor(digitableLine) {
        this.digitableLine = digitableLine;
    }

    getBoleto() {
        const DealerPaymentType = this.digitableLine[0] === '8' && this.digitableLine.length === 48;

        if (!DealerPaymentType) return new BankBondsBoleto(this.digitableLine);
        else return new DealerPaymentBoleto(this.digitableLine);
    }
}

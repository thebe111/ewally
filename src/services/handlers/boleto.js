const Formatter = require('./../../core/Formatter');
const Identifier = require('./../../domain/Identifier');
const Validator = require('./../../domain/Validator');

module.exports = {
    get(req, res) {
        try {
            const digitableLine = req.params.digitableLine;

            const identifier = new Identifier(digitableLine);
            const boleto = identifier.getBoleto();
            const validator = new Validator(boleto);

            validator.validateBoleto();

            const barCode = boleto.extractBarCode();
            const expirationDate = boleto.extractExpirationDate();
            const rawAmount = boleto.extractAmount();

            const payload = Object.assign({},
                { barCode },
                expirationDate && { expirationDate },
                rawAmount && { amount: Formatter.formatAmount(rawAmount) },
            );

            return res.send(payload);
        } catch(e) {
            return res.status(400).send({ error: true, message: e.message });
        }
    }
}

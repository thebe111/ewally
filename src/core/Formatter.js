module.exports = class Formatter {
    static formatDate(date) {
        const res = new Intl.DateTimeFormat('pt-BR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).format(date);

        const out = res.split('/').reverse().join('-');

        return out;
    }

    static formatAmount(amount) {
        const out = parseFloat(
            amount.replace(/[0-9]{2}$/, `.${amount.substring(amount.length - 2)}`)
        ).toFixed(2);

        return out;
    }
}

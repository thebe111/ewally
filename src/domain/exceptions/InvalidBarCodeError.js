const BaseException = require('./../../core/BaseException');

module.exports = class InvalidBarCodeError extends BaseException {
    constructor(barCode) {
        super(`Invalid bar code: ${barCode}`);
    }
}

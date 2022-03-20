const BaseException = require('./../../core/BaseException');

module.exports = class InvalidDigitableLineError extends BaseException {
    constructor(digitableLine) {
        super(`Invalid digitable line: ${digitableLine}`);
    }
}

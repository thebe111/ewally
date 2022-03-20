const BaseException = require('./../../core/BaseException');

module.exports = class InvalidBlockError extends BaseException {
    constructor(block) {
        super(`Invalid block: ${block}`);
    }
}

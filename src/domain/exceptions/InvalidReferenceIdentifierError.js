const BaseException = require('./../../core/BaseException');

module.exports = class InvalidReferenceIdentifierError extends BaseException {
    constructor(referenceIdentifier) {
        super(`Invalid reference identifier: ${referenceIdentifier}`);
    }
}

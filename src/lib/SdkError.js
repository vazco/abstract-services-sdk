
export class SdkError extends Error {
    constructor (code, message) {
        super(message);
        this.name = 'Action unsuccessful [' + code + ']';
        this.code = code;
    }
}

export function validateStatus (status, message) {
    if (!status || status < 300) {
        return;
    }
    throw new SdkError(status, message);
}

export function extendError (err, shouldThrow = false) {
    const response = err.response || {statusText: err.message, status: err.code || 500};
    const e = new SdkError(response.status, response.statusText || err.message);
    Object.assign(e, err, {message: response.statusText || err.message});
    if (shouldThrow) {
        throw  e;
    }
    return e;
}

SdkError.validateStatus = validateStatus;
SdkError.extendError = extendError;

export default SdkError;

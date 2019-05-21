export default class WebError extends Error {
    status = 0;
    message = '';

    constructor(message: string, status: number = 500) {
        super(message)
        Error.captureStackTrace(this, this.constructor)
        this.name = this.constructor.name
        this.status = status
        this.message = message
    }
};

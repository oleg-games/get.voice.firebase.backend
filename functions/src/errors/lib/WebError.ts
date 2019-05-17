export default class WebError extends Error {
    status = 0;

    constructor(message: string, status: number) {
        super(message)
        Error.captureStackTrace(this, this.constructor)
        this.name = this.constructor.name
        this.status = status || 500
    }
};

export class CustomError extends Error {
    statusCode: number;
    details?: any;

    constructor(message: string, statusCode = 400, details?: any) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;

        // Required to maintain stack trace
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this);
    }
}

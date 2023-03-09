import {Request, Response, NextFunction} from 'express';
import StatusCodes from 'http-status-codes';

export class HTTPError extends Error {
    status: number;
    constructor(status: number, name: string, message: string) {
        super(message);
        this.status = status;
        this.name = name;
    }
}

export class BadRequestError extends HTTPError {
    constructor(message?: string) {
        super(StatusCodes.BAD_REQUEST, 'Bad Request', message || 'Request sent to the server is invalid or corrupted');
    }
}

export const notFoundError = (req: Request, res: Response, next: NextFunction) => {
    throw new HTTPError(StatusCodes.NOT_FOUND, 'Not Found', 'The resource you were looking for does not exist');
};

export const catchErrors = (err: HTTPError, req: Request, res: Response, next: NextFunction) => {
    const status = err.status || StatusCodes.INTERNAL_SERVER_ERROR;
    return res.status(status).json({success: false, status: err.status, error: err.name, message: err.message});
};

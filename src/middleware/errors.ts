import {Request, Response, NextFunction} from 'express';
import StatusCodes from 'http-status-codes';

class HTTPError extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
    }
}

export const notFoundError = (req: Request, res: Response, next: NextFunction) => {
    throw new HTTPError('Error: Resource not found', StatusCodes.NOT_FOUND);
};

export const errors = (err: HTTPError, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    return res.status(statusCode).send(err.message);
};

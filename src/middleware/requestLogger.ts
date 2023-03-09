import {Request, Response, NextFunction} from 'express';

export const reqLogger = async (req: Request, res: Response, next: NextFunction) => {
    const method = req.method;
    const originalUrl = req.originalUrl;
    const time = new Date().toLocaleTimeString();
    console.log(`${method} ${originalUrl} ${time}`);
    next();
};

import { Request, Response, NextFunction } from 'express';
import { RequestHandler } from 'express-serve-static-core';

export class IdValidator {
    static validate(paramName: string): RequestHandler {
        return (req: Request, res: Response, next: NextFunction): void => {
            const id = parseInt(req.params[paramName]);
            
            if (!this.isValidId(id)) {
                res.status(400).json({
                    isSuccess: false,
                    message: `Invalid ${paramName} format`,
                    data: null
                });
                return;
            }
            
            req.params[paramName] = id.toString();
            next();
        };
    }

    private static isValidId(id: number): boolean {
        return !isNaN(id) && id > 0;
    }
}
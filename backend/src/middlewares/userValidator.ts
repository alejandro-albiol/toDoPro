import { Request, Response, NextFunction } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import { NoDataResult } from '../models/responses/ProcessResult.js';

export class UserValidator {
    static validateRegistration(): RequestHandler {
        return (req: Request, res: Response, next: NextFunction): void => {
            const { email, password, username } = req.body;

            if (!email || !password || !username) {
                res.status(400).json({
                    isSuccess: false,
                    message: 'Email, username and password are required',
                });
                return;
            }

            if (!this.isValidEmail(email)) {
                res.status(400).json({
                    isSuccess: false,
                    message: 'Invalid email format',
                });
                return;
            }

            if (!this.isValidPassword(password)) {
                res.status(400).json({
                    isSuccess: false,
                    message: 'Password must be at least 6 characters long',
                });
                return;
            }

            next();
        };
    }

    static validateLogin(): RequestHandler {
        return (req: Request, res: Response, next: NextFunction): void => {
            const { username, password } = req.body;

            if (!username || !password) {
                res.status(400).json({
                    isSuccess: false,
                    message: 'Username and password are required',
                });
                return;
            }

            if (!this.isValidPassword(password)) {
                res.status(400).json({
                    isSuccess: false,
                    message: 'Invalid password format',
                });
                return;
            }

            next();
        };
    }

    private static isValidEmail(email: string): boolean {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    private static isValidPassword(password: string): boolean {
        return password.length >= 6;
    }
}

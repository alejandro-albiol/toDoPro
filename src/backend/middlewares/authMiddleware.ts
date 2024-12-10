import { Request, Response, NextFunction } from 'express';
import { AuthenticationServices } from '../services/AuthenticationServices.js';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            isSuccess: false,
            message: 'Authentication token is required',
            data: null
        });
    }

    try {
        const userData = AuthenticationServices.verifyToken(token);
        req.body.userId = userData.id;
        next();
    } catch (error) {
        return res.status(403).json({
            isSuccess: false,
            message: 'Invalid or expired token',
            data: null
        });
    }
};
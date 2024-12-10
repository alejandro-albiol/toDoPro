import jwt from 'jsonwebtoken';
import { User } from '../models/entities/User.js';
import dotenv from 'dotenv';
dotenv.config();

export class AuthenticationServices {
    private static readonly JWT_SECRET = process.env.JWT_SECRET || (() => {
        throw new Error('JWT_SECRET is not defined in environment variables');
    })();
    private static readonly TOKEN_EXPIRATION = '24h';

    static generateToken(user: Partial<User>): string {
        const payload = {
            id: user.id,
            username: user.username,
            email: user.email
        };

        return jwt.sign(payload, this.JWT_SECRET, {
            expiresIn: this.TOKEN_EXPIRATION
        });
    }

    static verifyToken(token: string): any {
        try {
            return jwt.verify(token, this.JWT_SECRET);
        } catch (error) {
            throw new Error('Invalid token');
        }
    }
}

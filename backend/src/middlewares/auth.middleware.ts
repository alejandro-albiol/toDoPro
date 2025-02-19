import { Request, Response, NextFunction } from 'express';
import { JwtService } from '../auth/service/jwt.service.js';
import { InvalidTokenException } from '../auth/exceptions/invalid-token.exception.js';
import { ApiResponse } from '../shared/responses/api-response.js';
import { TokenExpiredException } from '../auth/exceptions/token-expired.exception.js';

declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                username: string;
            };
        }
    }
}

export class AuthMiddleware {
    constructor(private readonly jwtService: JwtService) {}

    authenticate = (req: Request, res: Response, next: NextFunction): void => {
        try {
            const token = this.extractTokenFromHeader(req);
            if (!token) {
                throw new InvalidTokenException('No token provided');
            }

            const decoded = this.jwtService.verifyToken(token);
            req.user = decoded;
            next();
        } catch (error) {
            if (error instanceof InvalidTokenException || error instanceof TokenExpiredException) {
                ApiResponse.unauthorized(res, error.message, error.errorCode);
            } else {
                ApiResponse.error(res, error);
            }
        }
    };

    private extractTokenFromHeader(req: Request): string | undefined {
        const [type, token] = req.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
} 
import { Request, Response, NextFunction } from 'express';
import { AuthMiddleware } from '../../../src/middlewares/auth.middleware.js';
import { JwtService } from '../../../src/auth/service/jwt.service.js';
import { InvalidTokenException } from '../../../src/auth/exceptions/invalid-token.exception.js';
import { AuthErrorCode } from '../../../src/auth/exceptions/enum/auth-error-codes.enum.js';

describe('AuthMiddleware', () => {
    let middleware: AuthMiddleware;
    let mockJwtService: jest.Mocked<JwtService>;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: jest.Mock<NextFunction>;
    let jsonSpy: jest.Mock;
    let statusSpy: jest.Mock;

    beforeEach(() => {
        mockJwtService = {
            verifyToken: jest.fn()
        } as any;

        jsonSpy = jest.fn();
        statusSpy = jest.fn().mockReturnThis();
        mockResponse = {
            json: jsonSpy,
            status: statusSpy
        };
        mockNext = jest.fn();

        middleware = new AuthMiddleware(mockJwtService);
    });

    it('should pass authentication with valid token', () => {
        const decodedToken = { userId: '1', username: 'testuser' };
        mockRequest = {
            headers: {
                authorization: 'Bearer valid.token.here'
            }
        };

        mockJwtService.verifyToken.mockReturnValueOnce(decodedToken);

        middleware.authenticate(mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockJwtService.verifyToken).toHaveBeenCalledWith('valid.token.here');
        expect(mockRequest.user).toEqual(decodedToken);
        expect(mockNext).toHaveBeenCalled();
        expect(statusSpy).not.toHaveBeenCalled();
        expect(jsonSpy).not.toHaveBeenCalled();
    });

    it('should reject request without authorization header', () => {
        mockRequest = {
            headers: {}
        };

        middleware.authenticate(mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockJwtService.verifyToken).not.toHaveBeenCalled();
        expect(statusSpy).toHaveBeenCalledWith(401);
        expect(jsonSpy).toHaveBeenCalledWith({
            success: false,
            error: {
                code: AuthErrorCode.INVALID_TOKEN,
                message: 'No token provided'
            }

        });
        expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject request with malformed authorization header', () => {
        mockRequest = {
            headers: {
                authorization: 'malformed-token'
            }
        };

        middleware.authenticate(mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockJwtService.verifyToken).not.toHaveBeenCalled();
        expect(statusSpy).toHaveBeenCalledWith(401);
        expect(jsonSpy).toHaveBeenCalledWith({
            success: false,
            error: {
                code: AuthErrorCode.INVALID_TOKEN,
                message: 'No token provided'
            }

        });
        expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject request with invalid token', () => {
        mockRequest = {
            headers: {
                authorization: 'Bearer invalid.token.here'
            }
        };

        const error = new InvalidTokenException('Invalid token');
        mockJwtService.verifyToken.mockImplementationOnce(() => {
            throw error;
        });

        middleware.authenticate(mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockJwtService.verifyToken).toHaveBeenCalledWith('invalid.token.here');
        expect(statusSpy).toHaveBeenCalledWith(401);
        expect(jsonSpy).toHaveBeenCalledWith({
            success: false,
            error: {
                code: error.errorCode,
                message: error.message,
                metadata: process.env.NODE_ENV === 'development' ? {
                    stack: error.stack
                } : undefined
            }
        });
        expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle unexpected errors', () => {
        mockRequest = {
            headers: {
                authorization: 'Bearer valid.token.here'
            }
        };

        const error = new Error('Unexpected error');
        mockJwtService.verifyToken.mockImplementationOnce(() => {
            throw error;
        });

        middleware.authenticate(mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockJwtService.verifyToken).toHaveBeenCalledWith('valid.token.here');
        expect(statusSpy).toHaveBeenCalledWith(500);
        expect(jsonSpy).toHaveBeenCalledWith({
            success: false,
            error: {
                code: 'INTERNAL_SERVER_ERROR',
                message: error.message,
                metadata: process.env.NODE_ENV === 'development' ? {
                    stack: error.stack
                } : undefined
            }
        });
        expect(mockNext).not.toHaveBeenCalled();
    });
}); 
import { Request, Response } from 'express';
import { errorHandler } from '../../../src/middlewares/error-handler.js';
import { ApiResponse } from '../../../src/shared/responses/api-response.js';
import { UserException } from '../../../src/users/exceptions/base-user.exception.js';
import { UserErrorCodes } from '../../../src/users/exceptions/enums/user-error-codes.enum.js';
import { ErrorCode } from '../../../src/shared/models/constants/error-code.enum.js';

class TestUserException extends UserException {
    constructor(message: string, statusCode: number, errorCode: UserErrorCodes) {
        super(message, statusCode, errorCode);
    }
}

describe('Error Handler Middleware', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: jest.Mock;

    beforeEach(() => {
        mockRequest = {
            path: '/test',
            method: 'POST'
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            headersSent: false
        };
        mockNext = jest.fn();
    });

    it('should handle JSON parsing errors', () => {
        const error: any = {
            type: 'entity.parse.failed',
            message: 'Invalid JSON'
        };

        errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith(
            new ApiResponse(
                'error',
                'Invalid JSON format',
                null,
                [{
                    code: ErrorCode.INVALID_JSON_FORMAT,
                    message: 'Invalid JSON format'
                }]
            )
        );
    });

    it('should handle domain exceptions', () => {
        const error = new TestUserException('User error', 400, UserErrorCodes.USER_NOT_FOUND);

        errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith(
            new ApiResponse(
                'error',
                'User error',
                null,
                [{
                    code: UserErrorCodes.USER_NOT_FOUND,
                    message: 'User error'
                }]
            )
        );
    });

    it('should handle validation errors', () => {
        const error: any = {
            errors: [{
                msg: 'Invalid email',
                param: 'email',
                value: 'invalid-email'
            }]
        };

        errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith(
            new ApiResponse(
                'error',
                'Validation failed',
                null,
                [{
                    code: ErrorCode.INVALID_JSON_FORMAT,
                    message: 'Invalid email',
                    metadata: {
                        field: 'email',
                        value: 'invalid-email'
                    }
                }]
            )
        );
    });

    it('should handle unknown errors', () => {
        const error = new Error('Unknown error');

        errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith(
            new ApiResponse(
                'error',
                'Internal server error',
                null,
                [{
                    code: ErrorCode.UNKNOWN_ERROR,
                    message: 'Internal server error'
                }]
            )
        );
    });

    it('should pass to next middleware if headers already sent', () => {
        mockResponse.headersSent = true;
        const error = new Error('Test error');

        errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockNext).toHaveBeenCalledWith(error);
        expect(mockResponse.status).not.toHaveBeenCalled();
        expect(mockResponse.json).not.toHaveBeenCalled();
    });
});
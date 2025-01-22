import { Request, Response, NextFunction } from 'express';
import { DataBaseException } from '../shared/exceptions/DataBaseException.js';
import { ApiResponse } from '../shared/models/responses/ApiResponse.js';
import { IApiError } from '../shared/interfaces/responses/IApiError.js';
import { EmailAlreadyExistsException } from '../users/exceptions/email-already-exists.exception.js';
import { UsernameAlreadyExistsException } from '../users/exceptions/username-already-exists.exception.js';
import { DataBaseErrorCode } from '../shared/exceptions/enums/DataBaseErrorCode.enum.js';
import { ErrorCode } from '../shared/exceptions/enums/ErrorCode.enum.js';
import { UserNotFoundException } from '../users/exceptions/user-not-found.exception.js';
import { UserException } from '../users/exceptions/base-user.exception.js';
import { InvalidUserDataException } from '../users/exceptions/invalid-user-data.exception.js';

export const errorHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {

    if (res.headersSent) {
        return;
    }

    if ((error as any).type === 'entity.parse.failed' || error.name === 'SyntaxError') {
        const apiError: IApiError = {
            code: ErrorCode.INVALID_JSON_FORMAT,
            message: error.message
        };
        return res.status(400).json(
            new ApiResponse('error', 'Invalid JSON format', null, [apiError])
        );
    }

    if (error instanceof UserException) {
        const apiError: IApiError = {
            code: error.errorCode,
            message: error.message
        };

        if (error instanceof UserNotFoundException) {
            return res.status(404).json(
                new ApiResponse('error', 'User not found', null, [apiError])
            );
        }

        if (error instanceof EmailAlreadyExistsException) {
            return res.status(409).json(
                new ApiResponse('error', 'Email already exists', null, [apiError])
            );
        }

        if (error instanceof UsernameAlreadyExistsException) {
            return res.status(409).json(
                new ApiResponse('error', 'Username already exists', null, [apiError])
            );
        }

        if (error instanceof InvalidUserDataException) {
            return res.status(400).json(
                new ApiResponse('error', 'Invalid user data', null, [apiError])
            );
        }

        return res.status(400).json(
            new ApiResponse('error', 'User operation failed', null, [apiError])
        );
    }

    if (error instanceof DataBaseException) {
        const apiError: IApiError = {
            code: error.code,
            message: error.message
        };

        if (error.code === DataBaseErrorCode.INVALID_INPUT) {
            return res.status(400).json(
                new ApiResponse('error', 'Invalid data type provided', null, [apiError])
            );
        }

        if (error.code === DataBaseErrorCode.UNIQUE_VIOLATION) {
            return res.status(409).json(
                new ApiResponse('error', 'User already exists', null, [apiError])
            );
        }

        return res.status(500).json(
            new ApiResponse('error', 'An unexpected error occurred', null, [apiError])
        );
    }

    const unknownError: IApiError = {
        code: 'UNKNOWN_ERROR',
        message: 'Internal server error'
    };
    
    return res.status(500).json(
        new ApiResponse('error', 'Internal server error', null, [unknownError])
    );
}
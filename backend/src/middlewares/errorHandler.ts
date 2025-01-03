import { Request, Response, NextFunction } from 'express';
import { DataBaseException } from '../shared/exceptions/DataBaseException.js';
import { ApiResponse } from '../shared/models/responses/ApiResponse.js';
import { IApiError } from '../shared/interfaces/responses/IApiError.js';
import { EmailAlreadyExistsException } from '../users/exceptions/EmailAlreadyExists.exception.js';
import { UsernameAlreadyExistsException } from '../users/exceptions/UsernameAlreadyExists.exception.js';
import { DataBaseErrorCode } from '../shared/exceptions/enums/DataBaseErrorCode.enum.js';

export const errorHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.log('ErrorHandler received:', error);
    console.log('Error type in handler:', error.constructor.name);

    if (error instanceof EmailAlreadyExistsException) {
        const apiError: IApiError = {
            code: DataBaseErrorCode.UNIQUE_VIOLATION,
            message: error.message
        };
        return res.status(409).json(
            new ApiResponse('error', error.message, null, [apiError])
        );
    }

    if (error instanceof UsernameAlreadyExistsException) {
        const apiError: IApiError = {
            code: DataBaseErrorCode.UNIQUE_VIOLATION,
            message: error.message
        };
        return res.status(409).json(
            new ApiResponse('error', error.message, null, [apiError])
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

        return res.status(500).json(
            new ApiResponse('error', error.message, null, [apiError])
        );
    }

    const unknownError: IApiError = {
        code: 'UNKNOWN_ERROR',
        message: 'Internal server error'
    };
    console.error('Unhandled error:', error);
    return res.status(500).json(
        new ApiResponse('error', 'Internal server error', null, [unknownError])
    );
};
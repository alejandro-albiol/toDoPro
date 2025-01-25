import { Request, Response, NextFunction } from 'express';
import { DataBaseException } from '../shared/models/exceptions/data-base.exception.js';
import { ApiResponse } from '../shared/responses/api-response.js';
import { IApiError } from '../shared/models/interfaces/responses/i-api-error.js';
import { DataBaseErrorCode } from '../shared/models/exceptions/enums/data-base-error-code.enum.js';
import { ErrorCode } from '../shared/models/exceptions/enums/error-code.enum.js';
import { UserException } from '../users/exceptions/base-user.exception.js';
import { TaskException } from '../tasks/exceptions/base-task.exception.js';

export const errorHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (res.headersSent) {
        return next(error);
    }

    if ((error as any).type === 'entity.parse.failed' || error.name === 'SyntaxError') {
        const apiError: IApiError = {
            code: ErrorCode.INVALID_JSON_FORMAT,
            message: 'Invalid JSON format'
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
        return res.status(error.statusCode).json(
            new ApiResponse('error', error.message, null, [apiError])
        );
    }

    if (error instanceof TaskException) {
        const apiError: IApiError = {
            code: error.errorCode,
            message: error.message
        };
        return res.status(error.statusCode).json(
            new ApiResponse('error', error.message, null, [apiError])
        );
    }

    if (error instanceof DataBaseException) {
        const apiError: IApiError = {
            code: error.code,
            message: error.message
        };

        switch (error.code) {
            case DataBaseErrorCode.INVALID_INPUT:
                return res.status(400).json(
                    new ApiResponse('error', 'Invalid data format', null, [apiError])
                );
            case DataBaseErrorCode.NOT_FOUND:
                return res.status(404).json(
                    new ApiResponse('error', 'Resource not found', null, [apiError])
                );
            case DataBaseErrorCode.UNIQUE_VIOLATION:
                return res.status(409).json(
                    new ApiResponse('error', 'Resource already exists', null, [apiError])
                );
            case DataBaseErrorCode.FOREIGN_KEY_VIOLATION:
                return res.status(409).json(
                    new ApiResponse('error', 'Cannot delete due to existing references', null, [apiError])
                );
            default:
                return res.status(500).json(
                    new ApiResponse('error', 'Database error', null, [apiError])
                );
        }
    }

    const unknownError: IApiError = {
        code: ErrorCode.UNKNOWN_ERROR,
        message: 'Internal server error'
    };
    
    console.error('Unhandled error:', error);
    return res.status(500).json(
        new ApiResponse('error', 'Internal server error', null, [unknownError])
    );
};
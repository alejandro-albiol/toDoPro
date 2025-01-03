import { Request, Response, NextFunction } from 'express';
import { BaseException } from '../shared/exceptions/BaseException';
import { DataBaseException } from '../shared/exceptions/DataBaseException';
import { ApiResponse } from '../shared/models/responses/ApiResponse';
import { IApiError } from '../shared/interfaces/responses/IApiError';

export const errorHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (error instanceof BaseException) {
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
            message: 'Database error'
        };
        return res.status(500).json(
            new ApiResponse('error', 'Database error', null, [apiError])
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
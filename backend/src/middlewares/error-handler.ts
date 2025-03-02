import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../shared/responses/api-response.js';
import { IApiError } from '../shared/models/interfaces/responses/i-api-error.js';
import { ErrorCode } from '../shared/models/constants/error-code.enum.js';
import { UserException } from '../users/exceptions/base-user.exception.js';
import { TaskException } from '../tasks/exceptions/base-task.exception.js';
import { AuthException } from '../auth/exceptions/base-auth.exception.js';
import { AiException } from '../ai/exceptions/ai-base.exception.js';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (res.headersSent) {
    return next(error);
  }

  if (
    (error as any).type === 'entity.parse.failed' ||
    error.name === 'SyntaxError'
  ) {
    const apiError: IApiError = {
      code: ErrorCode.INVALID_JSON_FORMAT,
      message: 'Invalid JSON format',
    };
    return res
      .status(400)
      .json(new ApiResponse('error', 'Invalid JSON format', null, [apiError]));
  }

  if (
    error instanceof UserException ||
    error instanceof TaskException ||
    error instanceof AuthException ||
    error instanceof AiException
  ) {
    const apiError: IApiError = {
      code: error.errorCode,
      message: error.message,
    };
    return res
      .status(error.statusCode)
      .json(new ApiResponse('error', error.message, null, [apiError]));
  }

  if (Array.isArray((error as any).errors)) {
    const validationErrors = (error as any).errors.map((err: any) => ({
      code: ErrorCode.INVALID_JSON_FORMAT,
      message: err.msg,
      metadata: {
        field: err.param,
        value: err.value,
      },
    }));
    return res
      .status(400)
      .json(
        new ApiResponse('error', 'Validation failed', null, validationErrors),
      );
  }

  console.error('Unhandled error:', {
    name: error.name,
    message: error.message,
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method,
  });

  const unknownError: IApiError = {
    code: ErrorCode.UNKNOWN_ERROR,
    message: 'Internal server error',
  };

  return res
    .status(500)
    .json(
      new ApiResponse('error', 'Internal server error', null, [unknownError]),
    );
};

import { IApiResponse } from '../models/interfaces/responses/i-api-response.js';
import { IApiError } from '../models/interfaces/responses/i-api-error.js';
import { Response } from 'express';
import { BaseException } from '../exceptions/base.exception.js';

export class ApiResponse<T = any> implements IApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  data?: T;
  errors?: IApiError[];

  constructor(
    status: 'success' | 'error',
    message: string,
    data?: T,
    errors?: IApiError[],
  ) {
    this.status = status;
    this.message = message;
    this.data = data;
    if (errors) this.errors = errors;
  }

  static success(res: Response, data: any): void {
    res.status(200).json({
      success: true,
      data,
    });
  }

  static created(res: Response, data: any): void {
    res.status(201).json({
      success: true,
      data,
    });
  }

  static error(
    res: Response,
    error: BaseException | Error | unknown,
    statusCode: number = 500,
  ): void {
    if (error instanceof BaseException) {
      res.status(statusCode).json({
        success: false,
        errors: {
          code: error.errorCode,
          message: error.message,
          metadata:
            process.env.NODE_ENV === 'development'
              ? {
                  stack: error.stack,
                }
              : undefined,
        },
      });
    } else if (error instanceof Error) {
      res.status(statusCode).json({
        success: false,
        errors: {
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message,
          metadata:
            process.env.NODE_ENV === 'development'
              ? {
                  stack: error.stack,
                }
              : undefined,
        },
      });
    } else {
      res.status(statusCode).json({
        success: false,
        errors: {
          code: 'UNKNOWN_ERROR',
          message: 'An unexpected error occurred',
          metadata: {
            error:
              error instanceof Object ? JSON.stringify(error) : 'Unknown error',
          },
        },
      });
    }
  }

  static notFound(
    res: Response,
    message: string,
    errorCode: string = 'NOT_FOUND',
  ): void {
    res.status(404).json({
      success: false,
      errors: {
        code: errorCode,
        message,
      },
    });
  }

  static badRequest(
    res: Response,
    message: string,
    errorCode: string = 'BAD_REQUEST',
  ): void {
    res.status(400).json({
      success: false,
      errors: {
        code: errorCode,
        message,
      },
    });
  }

  static unauthorized(
    res: Response,
    message: string,
    errorCode: string = 'UNAUTHORIZED',
  ): void {
    res.status(401).json({
      success: false,
      errors: {
        code: errorCode,
        message,
      },
    });
  }

  static forbidden(
    res: Response,
    message: string,
    errorCode: string = 'FORBIDDEN',
  ): void {
    res.status(403).json({
      success: false,
      errors: {
        code: errorCode,
        message,
      },
    });
  }
}

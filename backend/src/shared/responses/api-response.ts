import { IApiResponse } from '../models/interfaces/responses/i-api-response.js';
import { IApiError } from '../models/interfaces/responses/i-api-error.js';
import { Response } from 'express';
import { BaseException } from '../models/interfaces/base/i-base.exception.js';

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
      data
    });
  }

  static created(res: Response, data: any): void {
    res.status(201).json({
      success: true,
      data
    });
  }

  static error(res: Response, error: BaseException): void {
    res.status(error.statusCode).json({
      success: false,
      error: {
        code: error.errorCode,
        message: error.message,
        metadata: error.stack
      }
    });
  }

  static notFound(res: Response, message: string, errorCode: string = 'NOT_FOUND'): void {
    res.status(404).json({
      success: false,
      error: {
        code: errorCode,
        message
      }
    });
  }

  static internalError(res: Response, error: unknown): void {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred',
        metadata: { detail: error instanceof Error ? error.message : 'Unknown error' }
      }
    });
  }
}
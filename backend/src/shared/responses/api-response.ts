import { IApiResponse } from '../interfaces/responses/i-api-response.js';
import { IApiError } from '../interfaces/responses/i-api-error.js';

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
    if (data) this.data = data;
    if (errors) this.errors = errors;
  }
}

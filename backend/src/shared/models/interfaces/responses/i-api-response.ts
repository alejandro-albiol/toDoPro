import { IApiError } from './i-api-error.js';

export interface IApiResponse<T = any> {
  status: 'success' | 'error';
  message: string;
  data?: T;
  errors?: IApiError[];
}

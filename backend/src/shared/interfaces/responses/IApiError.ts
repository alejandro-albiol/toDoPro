export interface IApiError {
  type: 'validation' | 'database' | 'auth' | 'notFound' | 'business';
  field?: string;
  message: string;
}

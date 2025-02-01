export interface IApiError {
  code: string;
  message: string;
  metadata?: {
    constraint?: string;
    detail?: string;
    [key: string]: any;
  };
}

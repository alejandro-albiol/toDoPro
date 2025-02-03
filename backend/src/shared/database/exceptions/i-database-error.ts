export interface IGenericDatabaseError {
  code: string;
  message: string;
  metadata?: {
    detail?: string;
    constraint?: string;
    column?: string;
    table?: string;
    [key: string]: any;
  };
}

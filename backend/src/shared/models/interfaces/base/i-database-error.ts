import { DbErrorCode } from '../../../exceptions/enums/db-error-code.enum.js';

export interface IGenericDatabaseError {
  code: DbErrorCode;
  message: string;
  metadata?: {
    detail?: string;


    constraint?: string;
    column?: string;
    table?: string;
    [key: string]: any;
  };
}

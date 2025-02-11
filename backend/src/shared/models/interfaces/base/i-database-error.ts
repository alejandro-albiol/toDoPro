import { DbErrorCode } from '../../../exceptions/database/enum/db-error-code.enum.js';

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

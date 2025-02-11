import { DbErrorCode } from './enum/db-error-code.enum.js';
import { BaseException } from '../base.exception.js';

export class DatabaseException extends BaseException {
  constructor(
    message: string,
    public readonly errorCode: DbErrorCode,
    public readonly detail?: string
  ) {
    super(message, 500, errorCode, detail);
  }
}
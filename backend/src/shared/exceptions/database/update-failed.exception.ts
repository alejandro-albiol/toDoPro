import { DatabaseException } from './database.exception.js';
import { DbErrorCode } from './enum/db-error-code.enum.js';

export class UpdateFailedException extends DatabaseException {
  constructor(message: string, detail?: string) {
    super(message, DbErrorCode.UPDATE_FAILED, detail);
    this.statusCode = 400;
  }
}

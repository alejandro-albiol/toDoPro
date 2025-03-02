import { DatabaseException } from './database.exception.js';
import { DbErrorCode } from './enum/db-error-code.enum.js';

export class UniqueViolationException extends DatabaseException {
  constructor(message: string, detail?: string) {
    super(message, DbErrorCode.UNIQUE_VIOLATION, detail);
    this.statusCode = 409;
  }
}

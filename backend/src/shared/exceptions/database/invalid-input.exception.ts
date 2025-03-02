import { DatabaseException } from './database.exception.js';
import { DbErrorCode } from './enum/db-error-code.enum.js';

export class InvalidInputException extends DatabaseException {
  constructor(message: string, detail?: string) {
    super(message, DbErrorCode.INVALID_INPUT, detail);
    this.statusCode = 400;
  }
}

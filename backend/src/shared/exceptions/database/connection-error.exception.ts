import { DatabaseException } from './database.exception.js';
import { DbErrorCode } from './enum/db-error-code.enum.js';

export class ConnectionErrorException extends DatabaseException {
  constructor(message: string, detail?: string) {
    super(message, DbErrorCode.CONNECTION_ERROR, detail);
    this.statusCode = 500;
  }
}

import { DatabaseException } from "./database.exception.js";
import { DbErrorCode } from "./enum/db-error-code.enum.js";

export class ForeignKeyViolationException extends DatabaseException {
  constructor(message: string, detail?: string) {
    super(message, DbErrorCode.FOREIGN_KEY_VIOLATION, detail);
    this.statusCode = 409;
  }
}
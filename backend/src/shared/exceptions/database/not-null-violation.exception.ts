import { DatabaseException } from "./database.exception.js";
import { DbErrorCode } from "./enum/db-error-code.enum.js";

export class NotNullViolationException extends DatabaseException {
  constructor(message: string, detail?: string) {
    super(message, DbErrorCode.NOT_NULL_VIOLATION, detail);
    this.statusCode = 400;
  }
}
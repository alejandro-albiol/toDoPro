import { DatabaseException } from "./database.exception.js";
import { DbErrorCode } from "./enum/db-error-code.enum.js";

export class UndefinedColumnException extends DatabaseException {
  constructor(message: string, detail?: string) {
    super(message, DbErrorCode.UNDEFINED_COLUMN, detail);
    this.statusCode = 400;
  }
}
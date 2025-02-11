import { DatabaseException } from "./database.exception.js";
import { DbErrorCode } from "./enum/db-error-code.enum.js";

export class UnknownErrorException extends DatabaseException {
  constructor(message: string, detail?: string) {
    super(message, DbErrorCode.UNKNOWN_ERROR, detail);
    this.statusCode = 500;
  }
}
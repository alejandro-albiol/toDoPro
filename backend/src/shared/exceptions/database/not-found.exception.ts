import { DatabaseException } from "./database.exception.js";
import { DbErrorCode } from "./enum/db-error-code.enum.js";

export class NotFoundException extends DatabaseException {
    constructor(message: string, detail?: string) {
        super(message, DbErrorCode.NOT_FOUND, detail);
        this.statusCode = 404;
    }
}
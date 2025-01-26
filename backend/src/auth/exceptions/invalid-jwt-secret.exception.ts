import { AuthErrorCode } from "./enum/auth-error-codes.enum.js";
import { BaseException } from "../../shared/models/exceptions/base.exception.js";

export class InvalidJwtSecretException extends BaseException {
    constructor(message: string) {
        super(message, 500, AuthErrorCode.INVALID_JWT_SECRET);
    }
}
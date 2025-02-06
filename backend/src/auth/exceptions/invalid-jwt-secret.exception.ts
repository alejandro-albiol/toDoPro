import { BaseException } from "../../shared/exceptions/base.exception.js";
import { AuthErrorCode } from "./enum/auth-error-codes.enum.js";

export class InvalidJwtSecretException extends BaseException {
    constructor(message: string) {
        super(message, 500, AuthErrorCode.INVALID_JWT_SECRET);
    }
}
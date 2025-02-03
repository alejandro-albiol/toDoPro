import { BaseException } from "../../shared/models/interfaces/base/i-base.exception.js";
import { AuthErrorCode } from "./enum/auth-error-codes.enum.js";

export class InvalidCredentialsException extends BaseException {
    constructor(message: string) {
        super(message, 401, AuthErrorCode.INVALID_CREDENTIALS);
    }
}
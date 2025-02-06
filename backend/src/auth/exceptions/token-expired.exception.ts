import { BaseException } from "../../shared/exceptions/base.exception.js";
import { AuthErrorCode } from "./enum/auth-error-codes.enum.js";


export class TokenExpiredException extends BaseException {
    constructor(message: string) {
        super(message, 401, AuthErrorCode.TOKEN_EXPIRED);
    }
}
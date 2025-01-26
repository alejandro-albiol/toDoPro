import { AuthErrorCode } from "./enum/auth-error-codes.enum.js";

import { BaseException } from "../../shared/models/exceptions/base.exception.js";

export class TokenExpiredException extends BaseException {
    constructor(message: string) {
        super(message, 401, AuthErrorCode.TOKEN_EXPIRED);
    }
}
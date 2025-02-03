import { BaseException } from "../../shared/models/interfaces/base/i-base.exception.js";

import { AuthErrorCode } from "./enum/auth-error-codes.enum.js";

export abstract class AuthException extends BaseException {  
    constructor(message: string, statusCode: number, errorCode: AuthErrorCode) {
        super(message, statusCode, errorCode);
    }
}
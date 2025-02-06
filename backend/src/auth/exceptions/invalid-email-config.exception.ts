import { AuthException } from './base-auth.exception.js';
import { AuthErrorCode } from './enum/auth-error-codes.enum.js';

export class InvalidEmailConfigException extends AuthException {
    constructor(message: string) {
        super(message, 500, AuthErrorCode.INVALID_EMAIL_CONFIG);
    }
} 
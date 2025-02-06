import { UserException } from './base-user.exception.js';
import { UserErrorCodes } from './enums/user-error-codes.enum.js';

export class InvalidUserDataException extends UserException {
    constructor(message: string) {
        super(
            message,

            400,
            UserErrorCodes.INVALID_USER_DATA
        );
    }
} 
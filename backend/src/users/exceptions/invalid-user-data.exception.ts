import { BaseException } from '../../shared/models/interfaces/base/i-base.exception.js';
import { UserErrorCodes } from './enums/user-error-codes.enum.js';

export class InvalidUserDataException extends BaseException {
    constructor(message: string) {
        super(
            message,
            400,
            UserErrorCodes.INVALID_USER_DATA
        );
    }
} 
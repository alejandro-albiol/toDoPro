import { BaseException } from '../../shared/exceptions/BaseException.js';
import { ErrorCode } from '../../shared/exceptions/enums/ErrorCode.enum.js';

export class InvalidUserDataException extends BaseException {
    constructor(message: string) {
        super(
            message,
            400,
            ErrorCode.INVALID_USER_DATA
        );
    }
} 
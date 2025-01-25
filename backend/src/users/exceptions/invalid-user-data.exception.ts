import { BaseException } from '../../shared/models/exceptions/base.exception.js';
import { ErrorCode } from '../../shared/models/exceptions/enums/error-code.enum.js';

export class InvalidUserDataException extends BaseException {
    constructor(message: string) {
        super(
            message,
            400,
            ErrorCode.INVALID_USER_DATA
        );
    }
} 
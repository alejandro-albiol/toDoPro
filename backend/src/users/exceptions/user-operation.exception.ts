import { UserException } from './base-user.exception.js';
import { UserErrorCodes } from './enums/user-error-codes.enum.js';

export class UserOperationException extends UserException {
  constructor(message: string) {
    super(message, 500, UserErrorCodes.USER_OPERATION_FAILED);
  }
}
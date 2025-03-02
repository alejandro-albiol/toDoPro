import { UserException } from './base-user.exception.js';
import { UserErrorCodes } from './enums/user-error-codes.enum.js';

export class UserCreationFailedException extends UserException {
  constructor(message: string) {
    super(message, 400, UserErrorCodes.USER_CREATION_FAILED);
  }
}

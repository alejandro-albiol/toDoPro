import { UserException } from './base-user.exception.js';
import { UserErrorCodes } from './enums/user-error-codes.enum.js';

export class UserNotFoundException extends UserException {
  constructor(userId: string) {
    super(
      `User with id ${userId} not found`,
      404,
      UserErrorCodes.USER_NOT_FOUND,
    );
  }
}

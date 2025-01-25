import { UserException } from './base-user.exception.js';
import { UserErrorCodes } from './enums/user-error-codes.enum.js';

export class UsernameAlreadyExistsException extends UserException {
  constructor(username: string) {
    super(
      `User with username '${username}' already exists`,
      409,
      UserErrorCodes.USERNAME_ALREADY_EXISTS,
    );
  }
}

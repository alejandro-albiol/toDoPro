import { UserException } from './base-user.exception.js';
import { UserErrorCodes } from './enums/user-error-codes.enum.js';

export class EmailAlreadyExistsException extends UserException {
  constructor(email: string) {
    super(
      `User with email '${email}' already exists`,
      409,
      UserErrorCodes.EMAIL_ALREADY_EXISTS,
    );
  }
}

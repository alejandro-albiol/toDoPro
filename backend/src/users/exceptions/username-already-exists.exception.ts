import { ErrorCode } from '../../shared/models/exceptions/enums/error-code.enum.js';
import { UserException } from './base-user.exception.js';

export class UsernameAlreadyExistsException extends UserException {
  constructor(username: string) {
    super(
      `User with username '${username}' already exists`,
      409,
      ErrorCode.USERNAME_ALREADY_EXISTS,
    );
  }
}

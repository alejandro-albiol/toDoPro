import { ErrorCode } from '../../shared/exceptions/enums/ErrorCode.enum.js';
import { UserException } from './UserException.js';

export class UsernameAlreadyExistsException extends UserException {
  constructor(username: string) {
    super(
      `User with username ${username} already exists`,
      400,
      ErrorCode.USERNAME_ALREADY_EXISTS,
    );
  }
}

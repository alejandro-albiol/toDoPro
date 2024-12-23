import { BaseException } from '../../shared/exceptions/BaseException';
import { ErrorCode } from '../../shared/exceptions/ErrorCode.enum';

export class UsernameAlreadyExistsException extends BaseException {
  constructor(username: string) {
    super(
      `User with username ${username} already exists`,
      ErrorCode.USERNAME_ALREADY_EXISTS,
    );
  }
}

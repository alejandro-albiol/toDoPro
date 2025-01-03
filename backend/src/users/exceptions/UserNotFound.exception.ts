import { ErrorCode } from '../../shared/exceptions/enums/ErrorCode.enum.js';
import { UserException } from './UserException.js';

export class UserNotFoundException extends UserException {
  constructor(userId: string) {
    super(
      `User with id ${userId} not found`,
      404,
      ErrorCode.USER_NOT_FOUND,
    );
  }
}

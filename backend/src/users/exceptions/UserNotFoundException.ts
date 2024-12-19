import { BaseException } from '../../../shared/exceptions/BaseException.js';
import { ErrorCode } from '../../../shared/exceptions/ErrorCode.enum.js';

export class UserNotFoundException extends BaseException {
  constructor(userId: string) {
    super(`User with id ${userId} not found`, ErrorCode.USER_NOT_FOUND);
  }
}

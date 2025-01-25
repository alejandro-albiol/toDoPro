import { ErrorCode } from '../../shared/models/exceptions/enums/error-code.enum.js';
import { UserException } from './base-user.exception.js';

export class EmailAlreadyExistsException extends UserException {
  constructor(email: string) {
    super(
      `User with email '${email}' already exists`,
      409,
      ErrorCode.EMAIL_ALREADY_EXISTS,
    );
  }
}

import { BaseException } from '../../shared/exceptions/BaseException';
import { ErrorCode } from '../../shared/exceptions/ErrorCode.enum';

export class EmailAlreadyExistsException extends BaseException {
  constructor(email: string) {
    super(
      `User with email ${email} already exists`,
      ErrorCode.EMAIL_ALREADY_EXISTS,
    );
  }
}

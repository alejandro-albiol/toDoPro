import { ErrorCode } from '../../shared/exceptions/enums/ErrorCode.enum';
import { UserException } from './UserException';

export class EmailAlreadyExistsException extends UserException {
  constructor(email: string) {
    super(
      `User with email ${email} already exists`,
      400,
      ErrorCode.EMAIL_ALREADY_EXISTS,
    );
  }
}

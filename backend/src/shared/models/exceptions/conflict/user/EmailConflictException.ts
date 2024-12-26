import { UserConflictException } from './UserConflictException';

export class EmailConflictException extends UserConflictException {
  constructor(email: string) {
    super(email);
  }
}

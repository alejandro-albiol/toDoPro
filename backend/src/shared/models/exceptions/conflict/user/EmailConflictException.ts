import { UserConflictException } from './UserConflictException.js';

export class EmailConflictException extends UserConflictException {
  constructor(email: string) {
    super(email);
  }
}

import { UserConflictException } from './UserConflictException.js';

export class UsernameConflictException extends UserConflictException {
  constructor(username: string) {
    super(username);
  }
}

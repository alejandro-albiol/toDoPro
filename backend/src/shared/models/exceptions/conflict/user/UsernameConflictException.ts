import { UserConflictException } from './UserConflictException';

export class UsernameConflictException extends UserConflictException {
  constructor(username: string) {
    super(username);
  }
}

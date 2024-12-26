import { ConflictException } from '../ConflictException.js';

export class UserConflictException extends ConflictException {
  constructor(field: string) {
    super('User', field);
  }
}

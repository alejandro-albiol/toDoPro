import { AuthorizationException } from '../AuthorizationException.js';

export class UserAuthorizationException extends AuthorizationException {
  constructor(action: string) {
    super(action, 'user profile');
  }
}

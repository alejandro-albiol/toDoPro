import { AuthenticationException } from "../AuthenticationException.js";

export class UserAuthenticationException extends AuthenticationException {
  constructor() {
    super('Invalid user credentials or session expired');
  }
}

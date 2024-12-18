import { AuthenticationException } from "../AuthenticationException.js";

export class InvalidCredentialsException extends AuthenticationException {
  constructor() {
    super('Invalid email or password');
  }
}
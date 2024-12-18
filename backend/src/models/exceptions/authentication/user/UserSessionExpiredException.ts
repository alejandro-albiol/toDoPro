import { AuthenticationException } from "../AuthenticationException.js";

export class SessionExpiredException extends AuthenticationException {
  constructor() {
    super('Session has expired, please login again');
  }
}
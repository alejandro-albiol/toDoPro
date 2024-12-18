import { BaseException } from "../base/BaseException.js";

export class AuthenticationException extends BaseException {
  constructor(message: string) {
    super(
      message,
      401,
      'AUTHENTICATION_ERROR'
    );
  }
}   
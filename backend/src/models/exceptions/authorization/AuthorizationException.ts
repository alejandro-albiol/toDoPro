import { BaseException } from "../base/BaseException.js";

export class AuthorizationException extends BaseException {
  constructor(action: string, resource: string) {
    super(
      `Not authorized to ${action} ${resource}`,
      403,
      'AUTHORIZATION_ERROR'
    );
  }
}
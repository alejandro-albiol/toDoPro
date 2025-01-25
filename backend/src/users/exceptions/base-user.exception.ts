import { BaseException } from "../../shared/models/exceptions/base.exception.js";

export abstract class UserException extends BaseException {
  constructor(message: string, statusCode: number, errorCode: string) {
    super(message, statusCode, errorCode);
  }
}

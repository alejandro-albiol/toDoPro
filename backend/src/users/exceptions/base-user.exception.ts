import { BaseException } from "../../shared/models/interfaces/base/i-base.exception.js";
import { UserErrorCodes } from "./enums/user-error-codes.enum.js";

export abstract class UserException extends BaseException {
  constructor(message: string, statusCode: number, errorCode: UserErrorCodes) {
    super(message, statusCode, errorCode);
  }
}

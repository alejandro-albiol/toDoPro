import { BaseException } from "../../shared/exceptions/base.exception.js";
import { UserErrorCodes } from "./enums/user-error-codes.enum.js";


export abstract class UserException extends BaseException {
  constructor(message: string, statusCode: number, errorCode: UserErrorCodes) {
    super(message, statusCode, errorCode);
  }
}

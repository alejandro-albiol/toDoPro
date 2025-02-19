import { BaseException } from "../../shared/exceptions/base.exception.js";
import { AiErrorCodes } from "./enum/ai-error-codes.enum.js";

export abstract class AiException extends BaseException {
  constructor(message: string, statusCode: number, errorCode: AiErrorCodes) {
    super(message, statusCode, errorCode);
  }
}
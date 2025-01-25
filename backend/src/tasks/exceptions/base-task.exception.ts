import { BaseException } from "../../shared/models/exceptions/base.exception.js";
import { TaskErrorCodes } from "./enums/task-error-codes.enum.js";

export abstract class TaskException extends BaseException {
  constructor(message: string, statusCode: number, errorCode: TaskErrorCodes) {
    super(message, statusCode, errorCode);
  }
}
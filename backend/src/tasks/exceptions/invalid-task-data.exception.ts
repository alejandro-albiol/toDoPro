import { ErrorCode } from "../../shared/exceptions/enums/ErrorCode.enum.js";
import { TaskException } from "./base-task.exception.js";

export class InvalidTaskDataException extends TaskException {
  constructor(message: string) {
    super(
        message,
        400,
        ErrorCode.INVALID_TASK_DATA
    );
  }
}
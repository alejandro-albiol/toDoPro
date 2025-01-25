import { TaskException } from "./base-task.exception.js";
import { TaskErrorCodes } from "./enums/task-error-codes.enum.js";

export class InvalidTaskDataException extends TaskException {
  constructor(message: string) {
    super(
        message,
        400,
        TaskErrorCodes.INVALID_TASK_DATA
    );
  }
}
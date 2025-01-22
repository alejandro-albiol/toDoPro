import { ErrorCode } from "../../shared/exceptions/enums/ErrorCode.enum.js";
import { TaskException } from "./base-task.exception.js";

export class TaskNotFoundException extends TaskException {
  constructor(taskId: string) {
    super(
        `Task with id '${taskId}' not found`,
        404,
        ErrorCode.TASK_NOT_FOUND
    );
  }
}
import { TaskException } from "./base-task.exception.js";
import { TaskErrorCodes } from "./enums/task-error-codes.enum.js";

export class TaskNotFoundException extends TaskException {
  constructor(taskId: string) {
    super(
        `Task with id '${taskId}' not found`,
        404,
        TaskErrorCodes.TASK_NOT_FOUND
    );
  }
}
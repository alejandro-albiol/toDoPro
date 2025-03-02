import { TaskException } from './base-task.exception.js';
import { TaskErrorCodes } from './enums/task-error-codes.enum.js';

export class TaskCreationFailedException extends TaskException {
  constructor(message: string) {
    super(message, 400, TaskErrorCodes.TASK_CREATION_FAILED);
  }
}

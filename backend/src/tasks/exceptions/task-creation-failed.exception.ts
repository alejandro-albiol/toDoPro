import { ErrorCode } from "../../shared/exceptions/enums/ErrorCode.enum.js";
import { TaskException } from "./base-task.exception.js";

export class TaskCreationFailedException extends TaskException {
    constructor(message: string) {
        super(message, 400, ErrorCode.TASK_CREATION_FAILED);
    }
}
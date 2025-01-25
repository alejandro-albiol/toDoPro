import { ErrorCode } from "../../shared/models/exceptions/enums/error-code.enum.js";
import { TaskException } from "./base-task.exception.js";

export class TaskCreationFailedException extends TaskException {
    constructor(message: string) {
        super(message, 400, ErrorCode.TASK_CREATION_FAILED);
    }
}
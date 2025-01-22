import { UserException } from "./base-user.exception.js";
import { ErrorCode } from "../../shared/exceptions/enums/ErrorCode.enum.js";

export class UserCreationFailedException extends UserException {
    constructor(message: string) {
        super(message, 400, ErrorCode.USER_CREATION_FAILED);
    }
} 
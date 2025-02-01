import { DataBaseErrorCode } from "../../../src/shared/models/exceptions/enums/data-base-error-code.enum";
import { taskMock } from "../entities/task.mock";

import { userMock } from "../entities/user.mock";

export const queryResultMock = {
    success: {
        rows: [userMock.validUser],
        rowCount: 1
    },
    deleted: {
        rows: [],
        rowCount: 1
    },
    notFound: {
        rows: [],
        rowCount: 0
    },
    multipleUsers: {
        rows: userMock.userList,
        rowCount: userMock.userList.length
    },
    multipleTasks: {
        rows: taskMock.taskList,
        rowCount: taskMock.taskList.length
    },

    dbErrors: {
        uniqueViolation: {
            code: DataBaseErrorCode.UNIQUE_VIOLATION,
            detail: 'Key (email)=(test@test.com) already exists'
        },
        foreignKeyViolation: {
            code: DataBaseErrorCode.FOREIGN_KEY_VIOLATION,
            detail: 'Foreign key violation'
        },
        invalidInput: {
            code: DataBaseErrorCode.INVALID_INPUT,
            detail: 'Invalid input syntax'
        }
    },
}; 
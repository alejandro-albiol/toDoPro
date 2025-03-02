import { Request } from 'express';
import { BaseValidator } from './base-validator.js';
import { ErrorCode } from '../../shared/models/constants/error-code.enum.js';
import { TaskErrorCodes } from '../../tasks/exceptions/enums/task-error-codes.enum.js';

export class TaskValidator extends BaseValidator {
  static validateCreate() {
    return super.validateRules([
      (req: Request) => {
        const { title } = req.body;
        if (!this.isValidString(title, 3, 50)) {
          return {
            code: TaskErrorCodes.INVALID_TITLE,
            message: 'Title must be between 3 and 50 characters',
          };
        }
        return null;
      },
      (req: Request) => {
        const { description } = req.body;
        if (description && !this.isValidString(description, 0, 500)) {
          return {
            code: TaskErrorCodes.INVALID_DESCRIPTION,
            message: 'Description cannot exceed 500 characters',
          };
        }
        return null;
      },
    ]);
  }

  static validateUpdate() {
    return super.validateRules([
      (req: Request) => {
        const { title } = req.body;
        if (title !== undefined && !this.isValidString(title, 3, 50)) {
          return {
            code: TaskErrorCodes.INVALID_TITLE,
            message: 'Title must be between 3 and 50 characters',
          };
        }
        return null;
      },
      (req: Request) => {
        const { description } = req.body;
        if (
          description !== undefined &&
          !this.isValidString(description, 0, 500)
        ) {
          return {
            code: TaskErrorCodes.INVALID_DESCRIPTION,
            message: 'Description cannot exceed 500 characters',
          };
        }
        return null;
      },
    ]);
  }

  static validateDelete() {
    return super.validateRules([
      (req: Request) => {
        const { id } = req.params;
        if (!this.isValidId(id)) {
          return {
            code: ErrorCode.INVALID_ID_FORMAT,
            message: 'Invalid task ID',
          };
        }
        return null;
      },
    ]);
  }
}

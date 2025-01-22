import { NextFunction, Request, RequestHandler, Response } from 'express';
import { CreateTaskDTO } from '../../tasks/models/dtos/CreateTaskDTO.js';
import { IValidator } from '../../shared/interfaces/middlewares/IValidator.js';
import { UpdateTaskDTO } from '../../tasks/models/dtos/UpdateTaskDTO.js';
import { IApiError } from '../../shared/interfaces/responses/IApiError.js';
import { ApiResponse } from '../../shared/models/responses/ApiResponse.js';
import { InvalidTaskDataException } from '../../tasks/exceptions/invalid-task-data.exception.js';

export class TaskValidator implements IValidator {
  validateCreate(): RequestHandler {
    return (req: Request, res: Response, next: NextFunction): void => {
        const { title, description, user_id } = req.body;

        if (!title || typeof title !== 'string') {
            throw new InvalidTaskDataException('Title is required and must be a string');
        }

        if (description && typeof description !== 'string') {
            throw new InvalidTaskDataException('Description must be a string');
        }

        if (!user_id || typeof user_id !== 'string') {
            throw new InvalidTaskDataException('User ID is required and must be a string');
        }

        next();
    };
}

  validateUpdate(): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
      const data = req.body as Partial<CreateTaskDTO>;
      const errors: IApiError[] = [];

      if (data.title !== undefined) {
        if (!data.title.trim()) {
          errors.push({
            code: 'TITLE_REQUIRED',
            message: 'Title cannot be empty',
          });
        } else if (data.title.length < 3 || data.title.length > 50) {
          errors.push({
            code: 'TITLE_INVALID',
            message: 'Title must be between 3 and 50 characters',
          });
        }
      }

      if (data.description !== undefined) {
        if (!data.description.trim()) {
          errors.push({
            code: 'DESCRIPTION_REQUIRED',
            message: 'Description cannot be empty',
          });
        } else if (data.description.length > 500) {
          errors.push({
            code: 'DESCRIPTION_INVALID',
            message: 'Description cannot exceed 500 characters',
          });
        }
      }

      if (errors.length > 0) {
        return res
          .status(400)
          .json(
            new ApiResponse('error', 'Validation failed', undefined, errors),
          );
      }

      next();
    };
  }

  validateDelete(): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
      const id = req.params.id;
      const errors: IApiError[] = [];

      if (!id) {
        errors.push({
          code: 'TASK_ID_REQUIRED',
          message: 'Task ID is required for deletion',
        });
      }

      if (errors.length > 0) {
        return res
          .status(400)
          .json(
            new ApiResponse('error', 'Validation failed', undefined, errors),
          );
      }
      next();
    };
  }
}

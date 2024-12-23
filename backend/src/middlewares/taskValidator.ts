import { NextFunction, Request, Response } from 'express';
import { CreateTaskDto } from '../shared/interfaces/dtos/task/CreateTaskDto';
import { IValidator } from '../shared/interfaces/middlewares/IValidator.js';
import { UpdateTaskDto } from '../shared/interfaces/dtos/task/UpdateTaskDto';
import { IApiError } from '../shared/interfaces/responses/IApiError.js';
import { ApiResponse } from '../models/responses/ApiResponse';

export class TaskValidator implements IValidator {
  validateCreate() {
    return (req: Request, res: Response, next: NextFunction) => {
      const data = req.body as CreateTaskDto;
      const errors: IApiError[] = [];

      if (!data.title?.trim()) {
        errors.push({
          type: 'validation',
          field: 'title',
          message: 'Title is required',
        });
      } else if (data.title.length < 3 || data.title.length > 50) {
        errors.push({
          type: 'validation',
          field: 'title',
          message: 'Title must be between 3 and 50 characters',
        });
      }

      if (!data.description?.trim()) {
        errors.push({
          type: 'validation',
          field: 'description',
          message: 'Description is required',
        });
      } else if (data.description.length > 500) {
        errors.push({
          type: 'validation',
          field: 'description',
          message: 'Description cannot exceed 500 characters',
        });
      }

      if (!data.user_id) {
        errors.push({
          type: 'validation',
          field: 'user_id',
          message: 'User ID is required',
        });
      } else if (!/^\d+$/.test(data.user_id)) {
        errors.push({
          type: 'validation',
          field: 'user_id',
          message: 'User ID must be a valid number',
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

  validateUpdate() {
    return (req: Request, res: Response, next: NextFunction) => {
      const data = req.body as Partial<CreateTaskDto>;
      const errors: IApiError[] = [];

      if (data.title !== undefined) {
        if (!data.title.trim()) {
          errors.push({
            type: 'validation',
            field: 'title',
            message: 'Title cannot be empty',
          });
        } else if (data.title.length < 3 || data.title.length > 50) {
          errors.push({
            type: 'validation',
            field: 'title',
            message: 'Title must be between 3 and 50 characters',
          });
        }
      }

      if (data.description !== undefined) {
        if (!data.description.trim()) {
          errors.push({
            type: 'validation',
            field: 'description',
            message: 'Description cannot be empty',
          });
        } else if (data.description.length > 500) {
          errors.push({
            type: 'validation',
            field: 'description',
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

  validateDelete() {
    return (req: Request, res: Response, next: NextFunction) => {
      const id = req.params.id;
      const errors: IApiError[] = [];

      if (!id) {
        errors.push({
          type: 'validation',
          field: 'id',
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

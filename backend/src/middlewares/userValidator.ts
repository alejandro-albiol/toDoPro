import { Request, Response, NextFunction } from 'express';
import { CreateUserDTO, ChangePasswordDTO, LoginDTO } from '../users/models/dtos/UserDTO.js';
import { IValidator } from '../shared/interfaces/middlewares/IValidator.js';
import { IAuthValidator } from '../shared/interfaces/middlewares/IAuthValidator.js';
import { UpdateUserDTO } from '../users/models/dtos/UserDTO.js';
import { ApiResponse } from '../models/responses/ApiResponse.js';
import { IApiError } from '../shared/interfaces/responses/IApiError.js';

export class UserValidator implements IAuthValidator, IValidator {
  validateCreate() {
    return (req: Request, res: Response, next: NextFunction) => {
      const data = req.body as CreateUserDTO;
      const errors: IApiError[] = [];

      if (!data.username?.trim()) {
        errors.push({
          type: 'validation',
          field: 'username',
          message: 'Username is required',
        });
      }
      if (data.username.length < 3) {
        errors.push({
          type: 'validation',
          field: 'username',
          message: 'Username must be at least 3 characters long',
        });
      }
      if (!data.email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        errors.push({
          type: 'validation',
          field: 'email',
          message: 'Invalid email format',
        });
      }
      if (!data.password || data.password.length < 6) {
        errors.push({
          type: 'validation',
          field: 'password',
          message: 'Password must be at least 6 characters long',
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

  validateLogin() {
    return (req: Request, res: Response, next: NextFunction) => {
      const data = req.body as LoginDTO;
      const errors: IApiError[] = [];

      if (!data.username?.trim()) {
        errors.push({
          type: 'validation',
          field: 'username',
          message: 'Username is required',
        });
      }

      if (!data.password) {
        errors.push({
          type: 'validation',
          field: 'password',
          message: 'Password is required',
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

  validatePasswordUpdate() {
    return (req: Request, res: Response, next: NextFunction) => {
      const data = req.body as ChangePasswordDTO;
      const errors: IApiError[] = [];

      if (!data.currentPassword) {
        errors.push({
          type: 'validation',
          field: 'currentPassword',
          message: 'Current password is required',
        });
      }

      if (!data.newPassword || data.newPassword.length < 6) {
        errors.push({
          type: 'validation',
          field: 'newPassword',
          message: 'New password must be at least 6 characters long',
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
      const data = req.body as UpdateUserDTO;
      const errors: IApiError[] = [];

      if (!data.username && !data.email) {
        errors.push({
          type: 'validation',
          field: 'username or email',
          message:
            'At least one field (username or email) is required for update',
        });
      }

      if (data.username) {
        if (data.username.length < 3) {
          errors.push({
            type: 'validation',
            field: 'username',
            message: 'Username must be at least 3 characters long',
          });
        }
      }

      if (data.email) {
        if (!data.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
          errors.push({
            type: 'validation',
            field: 'email',
            message: 'Invalid email format',
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
}

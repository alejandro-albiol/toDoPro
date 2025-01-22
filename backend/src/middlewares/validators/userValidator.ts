import { RequestHandler, Request, Response, NextFunction } from 'express';
import { CreateUserDTO } from '../../users/models/dtos/CreateUserDTO.js';
import { IApiError } from '../../shared/interfaces/responses/IApiError.js';
import { ApiResponse } from '../../shared/models/responses/ApiResponse.js';
import { IAuthValidator } from '../../shared/interfaces/middlewares/IAuthValidator.js';
import { IValidator } from '../../shared/interfaces/middlewares/IValidator.js';
import { ChangePasswordDTO } from '../../users/models/dtos/UserDTO.js';
import { LoginDTO } from '../../users/models/dtos/UserDTO.js';
import { UpdateUserDTO } from '../../users/models/dtos/UpdateUserDTO.js';

export class UserValidator implements IAuthValidator, IValidator {
  validateCreate(): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
      const data = req.body as CreateUserDTO;
      const errors: IApiError[] = [];

      if (!data.username?.trim()) {
        errors.push({
          code: 'USERNAME_REQUIRED',
          message: 'Username is required',
        });
      }
      if (data.username.length < 3) {
        errors.push({
          code: 'USERNAME_TOO_SHORT',
          message: 'Username must be at least 3 characters long',
        });
      }
      if (!data.email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        errors.push({
          code: 'INVALID_EMAIL_FORMAT',
          message: 'Invalid email format',
        });
      }
      if (!data.password || data.password.length < 6) {
        errors.push({
          code: 'PASSWORD_TOO_SHORT',
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

  validateLogin(): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
      const data = req.body as LoginDTO;
      const errors: IApiError[] = [];

      if (!data.username?.trim()) {
        errors.push({
          code: 'USERNAME_REQUIRED',
          message: 'Username is required',
        });
      }

      if (!data.password) {
        errors.push({
          code: 'PASSWORD_REQUIRED',
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

  validatePasswordUpdate(): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
      const data = req.body as ChangePasswordDTO;
      const errors: IApiError[] = [];

      if (!data.currentPassword) {
        errors.push({
          code: 'CURRENT_PASSWORD_REQUIRED',
          message: 'Current password is required',
        });
      }

      if (!data.newPassword || data.newPassword.length < 6) {
        errors.push({
          code: 'NEW_PASSWORD_TOO_SHORT',
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

  validateUpdate(): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
      const data = req.body as UpdateUserDTO;
      const errors: IApiError[] = [];

      if (!data.username && !data.email) {
        errors.push({
          code: 'USERNAME_OR_EMAIL_REQUIRED',
          message:
            'At least one field (username or email) is required for update',
        });
      }

      if (data.username) {
        if (data.username.length < 3) {
          errors.push({
            code: 'USERNAME_TOO_SHORT',
            message: 'Username must be at least 3 characters long',
          });
        }
      }

      if (data.email) {
        if (!data.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
          errors.push({
            code: 'INVALID_EMAIL_FORMAT',
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

  validateDelete(): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
      next();
    };
  }
}

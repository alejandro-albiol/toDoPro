import { Request, Response, NextFunction } from 'express';
import { CreateUserDTO, ChangePasswordDTO } from '../models/dtos/UserDTO.js';

export class UserValidator {
  static validateRegistration() {
    return (req: Request, res: Response, next: NextFunction) => {
      const data = req.body as CreateUserDTO;

      if (!data.username?.trim() || data.username.length < 3) {
        return res.status(400).json({
          isSuccess: false,
          message: 'Username must be at least 3 characters long',
        });
      }

      if (!data.email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        return res.status(400).json({
          isSuccess: false,
          message: 'Invalid email format',
        });
      }

      if (!data.password || data.password.length < 6) {
        return res.status(400).json({
          isSuccess: false,
          message: 'Password must be at least 6 characters long',
        });
      }

      next();
    };
  }

  static validateLogin() {
    return (req: Request, res: Response, next: NextFunction) => {
      const data = req.body as LoginDTO;

      if (!data.username?.trim()) {
        return res.status(400).json({
          isSuccess: false,
          message: 'Username is required',
        });
      }

      if (!data.password) {
        return res.status(400).json({
          isSuccess: false,
          message: 'Password is required',
        });
      }

      next();
    };
  }

  static validatePasswordChange() {
    return (req: Request, res: Response, next: NextFunction) => {
      const data = req.body as ChangePasswordDTO;

      if (!data.currentPassword) {
        return res.status(400).json({
          isSuccess: false,
          message: 'Current password is required',
        });
      }

      if (!data.newPassword || data.newPassword.length < 6) {
        return res.status(400).json({
          isSuccess: false,
          message: 'New password must be at least 6 characters long',
        });
      }

      next();
    };
  }
}

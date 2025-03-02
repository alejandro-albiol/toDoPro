import { Request } from 'express';
import { BaseValidator } from './base-validator.js';
import { UserErrorCodes } from '../../users/exceptions/enums/user-error-codes.enum.js';

export class UserValidator extends BaseValidator {
  static validateCreate() {
    return this.validateRules([
      (req: Request) => {
        const { username } = req.body;
        if (!this.isValidString(username, 3, 30)) {
          return {
            code: UserErrorCodes.INVALID_USERNAME,
            message: 'Username must be between 3 and 30 characters',
          };
        }
        return null;
      },
      (req: Request) => {
        const { email } = req.body;
        if (!this.isValidEmail(email)) {
          return {
            code: UserErrorCodes.INVALID_EMAIL,
            message: 'Invalid email format',
          };
        }
        return null;
      },
      (req: Request) => {
        const { password } = req.body;
        if (!this.isValidPassword(password)) {
          return {
            code: UserErrorCodes.INVALID_PASSWORD,
            message:
              'Password must be at least 8 characters and contain letters and numbers',
          };
        }
        return null;
      },
    ]);
  }

  static validateUpdate() {
    return this.validateRules([
      (req: Request) => {
        const { username } = req.body;
        if (username && !this.isValidString(username, 3, 30)) {
          return {
            code: UserErrorCodes.INVALID_USERNAME,
            message: 'Username must be between 3 and 30 characters',
          };
        }
        return null;
      },
      (req: Request) => {
        const { email } = req.body;
        if (email && !this.isValidEmail(email)) {
          return {
            code: UserErrorCodes.INVALID_EMAIL,
            message: 'Invalid email format',
          };
        }
        return null;
      },
    ]);
  }

  static validateLogin() {
    return this.validateRules([
      (req: Request) => {
        const { username } = req.body;
        if (!this.isValidString(username, 3, 30)) {
          return {
            code: UserErrorCodes.INVALID_USERNAME,
            message: 'Username must be between 3 and 30 characters',
          };
        }
        return null;
      },
      (req: Request) => {
        const { password } = req.body;
        if (!this.isValidPassword(password)) {
          return {
            code: UserErrorCodes.INVALID_PASSWORD,
            message:
              'Password must be at least 8 characters and contain letters and numbers',
          };
        }
        return null;
      },
    ]);
  }

  static validateEmail() {
    return this.validateRules([
      (req: Request) => {
        const { email } = req.body;
        if (!this.isValidEmail(email)) {
          return {
            code: UserErrorCodes.INVALID_EMAIL,
            message: 'Invalid email format',
          };
        }
        return null;
      },
    ]);
  }

  static validatePasswordChange() {
    return this.validateRules([
      (req: Request) => {
        const { oldPassword: newPassword } = req.body;
        if (!this.isValidPassword(newPassword)) {
          return {
            code: UserErrorCodes.INVALID_PASSWORD,
            message:
              'Password must be at least 8 characters and contain letters and numbers',
          };
        }
        return null;
      },
      (req: Request) => {
        const { newPassword } = req.body;
        if (!this.isValidPassword(newPassword)) {
          return {
            code: UserErrorCodes.INVALID_PASSWORD,
            message:
              'New password must be at least 8 characters and contain letters and numbers',
          };
        }
        return null;
      },
    ]);
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private static isValidPassword(password: string): boolean {
    return (
      password.length >= 8 &&
      /[A-Za-z]/.test(password) &&
      /[0-9]/.test(password)
    );
  }

  protected static isValidString(
    str: string | undefined | null,
    minLength: number,
    maxLength: number,
  ): boolean {
    return !!str && str.length >= minLength && str.length <= maxLength;
  }
}

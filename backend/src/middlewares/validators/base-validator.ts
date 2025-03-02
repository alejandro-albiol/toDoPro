import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ApiResponse } from '../../shared/responses/api-response.js';
import { IApiError } from '../../shared/models/interfaces/responses/i-api-error.js';

export abstract class BaseValidator {
  protected static validateRules(
    validations: Array<(req: Request) => IApiError | null>,
  ): RequestHandler {
    return (req: Request, res: Response, next: NextFunction): void => {
      const errors: IApiError[] = [];

      for (const validation of validations) {
        const error = validation(req);
        if (error) errors.push(error);
      }

      if (errors.length > 0) {
        res
          .status(400)
          .json(new ApiResponse('error', 'Validation failed', null, errors));
        return;
      }
      next();
    };
  }

  protected static isValidId(id: string): boolean {
    const numericId = parseInt(id);
    return !isNaN(numericId) && numericId > 0;
  }

  protected static isValidString(
    value: any,
    minLength = 1,
    maxLength = Infinity,
  ): boolean {
    return (
      typeof value === 'string' &&
      value.trim().length >= minLength &&
      value.trim().length <= maxLength
    );
  }
}

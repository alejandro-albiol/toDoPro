import { Request, Response, NextFunction } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import { ErrorCode } from '../../shared/exceptions/enums/ErrorCode.enum.js';
import { ApiResponse } from '../../shared/models/responses/ApiResponse.js';

export class IdValidator {
  static validate(paramName: string): RequestHandler {
    return (req: Request, res: Response, next: NextFunction): void => {
      const id = req.params[paramName];

      const numericId = parseInt(id);
      if (!this.isValidId(numericId)) {
        res.status(400).json(new ApiResponse('error', `Invalid ${paramName} format`, null, [
          {
            code: ErrorCode.INVALID_ID_FORMAT,
            message: `Invalid ${paramName} format`,
          },
        ]));
        return;
      }

      req.params[paramName] = id;
      next();
    };
  }

  private static isValidId(id: number): boolean {
    return !isNaN(id) && id > 0;
  }
}

import { Request, Response, NextFunction } from 'express';
import { RequestHandler } from 'express-serve-static-core';

export class IdValidator {
  static validate(paramName: string): RequestHandler {
    return (req: Request, res: Response, next: NextFunction): void => {
      const id = req.params[paramName];

      const numericId = parseInt(id);
      if (!this.isValidId(numericId)) {
        res.status(400).json({
          isSuccess: false,
          message: `Invalid ${paramName} format`,
          data: null,
        });
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

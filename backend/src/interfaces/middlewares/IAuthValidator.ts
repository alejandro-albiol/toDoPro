import { Request, Response, NextFunction } from 'express';

export interface IAuthValidator {
  validateLogin(): (req: Request, res: Response, next: NextFunction) => void;
  validatePasswordUpdate?(): (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => void;
}

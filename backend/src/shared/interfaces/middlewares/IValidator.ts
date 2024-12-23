import { Request, Response, NextFunction } from 'express';

export interface IValidator {
  validateCreate(): (req: Request, res: Response, next: NextFunction) => void;
  validateUpdate(): (req: Request, res: Response, next: NextFunction) => void;
  validateDelete?(): (req: Request, res: Response, next: NextFunction) => void;
}

import { Request, Response, NextFunction } from 'express';

export interface IUserController {
  findById(req: Request, res: Response, next: NextFunction): Promise<void>;
  findByEmail(req: Request, res: Response, next: NextFunction): Promise<void>;
  findByUsername(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  create(req: Request, res: Response, next: NextFunction): Promise<void>;
  update(req: Request, res: Response, next: NextFunction): Promise<void>;
  delete(req: Request, res: Response, next: NextFunction): Promise<void>;
}

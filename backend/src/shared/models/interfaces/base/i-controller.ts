import { Request, Response } from 'express';

export interface IBaseController {
  create(req: Request, res: Response): Promise<void>;
  findAll(req: Request, res: Response): Promise<void>;
  findById(req: Request, res: Response): Promise<void>;
  update(req: Request, res: Response): Promise<void>;
  delete(req: Request, res: Response): Promise<void>;
} 
import { Request, Response } from 'express';
import { IBaseController } from '../../shared/models/interfaces/base/i-controller.js';

export interface IUserController extends IBaseController {
    updatePassword(req: Request, res: Response): Promise<void>;
}
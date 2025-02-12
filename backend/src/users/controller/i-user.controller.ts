import { Request, Response } from 'express';
import { IBaseController } from '../../shared/models/interfaces/base/i-controller.js';

export interface IUserController extends IBaseController {
/**
 * Updates the user's password.
 * 
 * @param req - The request object containing user data.
 * @param res - The response object to send the result.
 */
    updatePassword(req: Request, res: Response): Promise<void>;
}
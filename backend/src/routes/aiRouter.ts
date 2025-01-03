import Express, { Request, Response, NextFunction } from 'express';
import { IdValidator } from '../middlewares/IdValidator.js';

const aiRouter = Express.Router();

aiRouter.get('/recommendation/:userId', IdValidator.validate('userId'));

export default aiRouter;

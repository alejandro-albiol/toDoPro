import Express from 'express';
import userRouter from './userRouter.js';

const apiRouter = Express.Router();

apiRouter.use('/users', userRouter);

export default apiRouter;

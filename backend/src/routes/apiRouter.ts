import Express from 'express';
import userRouter from './user-router.js';

const apiRouter = Express.Router();

apiRouter.use('/users', userRouter);

export default apiRouter;

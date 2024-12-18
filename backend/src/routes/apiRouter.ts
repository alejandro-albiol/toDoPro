import Express from 'express';
import userRouter from './userRouter.js';
import tasksRouter from './taskRouter.js';
import aiRouter from './aiRouter.js';

const apiRouter = Express.Router();

apiRouter.use('/users', userRouter);
apiRouter.use('/tasks', tasksRouter);
apiRouter.use('/ai', aiRouter);

export default apiRouter;

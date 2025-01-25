import Express from 'express';
import userRouter from './user-router.js';
import taskRouter from './task-router.js';
import aiRouter from './ai-router.js';

const apiRouter = Express.Router();

apiRouter.use('/users', userRouter);
apiRouter.use('/tasks', taskRouter);
apiRouter.use('/ai', aiRouter);

export default apiRouter;

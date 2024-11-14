import Express from 'express';
import userRouter from './userRouter.js';
import tasksRouter from './taskRouter.js';

const apiRouter = Express.Router();

apiRouter.use("/users", userRouter);
apiRouter.use("/tasks", tasksRouter);

export default apiRouter;
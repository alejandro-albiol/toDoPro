import express from 'express';
import { errorHandler } from './middlewares/error-handler.js';
import userRouter from './routes/user-router.js';
import swaggerUi from 'swagger-ui-express';
import { swaggerConfig } from './docs/swagger.config.js';
import taskRouter from './routes/task-router.js';
import aiRouter from './routes/ai-router.js';
import staticRouter from './routes/static-router.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const apiRouter = express.Router();

apiRouter.use('/users', userRouter);
apiRouter.use('/tasks', taskRouter);
apiRouter.use('/ai', aiRouter);

app.use('/api/v1', apiRouter);

app.use('/', staticRouter);

app.use('/api-docs', swaggerUi.serve as unknown as express.RequestHandler[]);
app.use('/api-docs', swaggerUi.setup(swaggerConfig, { explorer: true }) as unknown as express.RequestHandler);
app.use(errorHandler);

export default app;
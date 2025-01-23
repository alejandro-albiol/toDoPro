import express from 'express';
import { errorHandler } from './middlewares/error-handler.js';
import userRouter from './routes/user-router.js';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';

const app = express();

app.use(express.json());
app.use('/api/v1/users', userRouter);
app.use('/api-docs', swaggerUi.serve as unknown as express.RequestHandler[]);
app.use('/api-docs', swaggerUi.setup(swaggerSpec, { explorer: true }) as unknown as express.RequestHandler);
app.use(errorHandler);

export { app };
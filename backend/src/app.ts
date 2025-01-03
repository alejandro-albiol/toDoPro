import express from 'express';
import { errorHandler } from './middlewares/errorHandler';
import userRouter from './routes/userRouter';

const app = express();

app.use(express.json());
app.use('/api/v1/users', userRouter);
app.use(errorHandler);

export { app };
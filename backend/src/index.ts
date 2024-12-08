import Express from 'express';
import { publicPath } from './configuration/config.js';
import apiRouter from './routes/apiRouter.js';
import staticRouter from './routes/staticRouter.js';

const app = Express();
const port = 3000;

app.use(Express.urlencoded({ extended: true }));
app.use(Express.static(publicPath));
app.use(Express.json());

app.use('/', staticRouter);
app.use('/api/v1', apiRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

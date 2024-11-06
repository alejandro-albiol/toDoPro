import { Router } from 'express';
import path from 'path';
import { __dirname, __filename } from '../configuration/config.js';

const tasksRouter = Router();

tasksRouter.get('/tasks/:username', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/tasks.html'));
});

export default tasksRouter;

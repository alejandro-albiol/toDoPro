import Express, { Request, Response, NextFunction } from 'express';
import { TaskController } from '../controllers/TaskController.js';

const tasksRouter = Express.Router();

tasksRouter.post('/:userId/newTask', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await TaskController.newTask(req.body, req.params.userId);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

tasksRouter.get('/user/:userId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.userId;
    const result = await TaskController.getTasksByUserId(userId)
    res.json(result);
  } catch (error) {
    next(error);
  }
});

tasksRouter.get('/:taskId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const taskId = req.params.taskId;
    const result = await TaskController.getTaskById(taskId);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

tasksRouter.put('/:taskId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const taskId = parseInt(req.params.taskId);
    const result = await TaskController.updateTask(taskId, req.body)
    res.json(result);
  } catch (error) {
    next(error);
  }
});

tasksRouter.delete('/:taskId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const taskId = req.params.taskId
    const result = await TaskController.deleteTask(taskId);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

tasksRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await TaskController.getAllTasks();
    if (result.isSuccess) {
      res.status(200).json(result.result);
    } else {
      res.status(404).json({ message: result.message });
    }
  } catch (error) {
    next(error);
  }
});

tasksRouter.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  res.status(500).json({ message: 'Internal Server Error' });
});

export default tasksRouter;

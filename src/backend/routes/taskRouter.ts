import Express, { Request, Response, NextFunction } from 'express';
import { TaskController } from '../controllers/TaskController.js';
import { Task } from '../models/Task.js';

const tasksRouter = Express.Router();

tasksRouter.post(
  '/:userId/newTask',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const taskData = req.body as Task;
      const result = await TaskController.newTask(taskData, req.params.userId);
      if (result.isSuccess) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      next(error);
    }
  },
);

tasksRouter.get(
  '/:userId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.userId;
      const result = await TaskController.getTasksByUserId(userId);
      if (result.isSuccess) {
        res.status(200).json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error) {
      next(error);
    }
  },
);

tasksRouter.get(
  '/id/:taskId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const taskId = req.params.taskId;
      const result = await TaskController.getTaskById(taskId);
      if (result.isSuccess) {
        res.status(200).json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error) {
      next(error);
    }
  },
);

tasksRouter.put(
  '/:taskId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const taskId = parseInt(req.params.taskId);
      const taskData = req.body as Task;
      const result = await TaskController.updateTask(taskId, taskData);
      if (result.isSuccess) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      next(error);
    }
  },
);

tasksRouter.delete(
  '/:taskId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const taskId = req.params.taskId;
      const result = await TaskController.deleteTask(taskId);
      if (result.isSuccess) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      next(error);
    }
  },
);

tasksRouter.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await TaskController.getAllTasks();
      if (result.isSuccess) {
        res.status(200).json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error) {
      next(error);
    }
  },
);

tasksRouter.patch(
  '/:taskId/complete',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await TaskController.completeTask(req.params.taskId);
      if (result.isSuccess) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      next(error);
    }
  },
);

tasksRouter.use(
  (error: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
    next(error);
  },
);

export default tasksRouter;

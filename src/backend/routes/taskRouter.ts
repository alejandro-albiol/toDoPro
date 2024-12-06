import Express, { Request, Response, NextFunction } from 'express';
import { TaskController } from '../controllers/TaskController.js';
import { IdValidator } from '../middlewares/IdValidator.js';

const tasksRouter = Express.Router();

tasksRouter.get(
  '/user/:userId',
  IdValidator.validate('userId'),
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
  '/detail/:taskId',
  IdValidator.validate('taskId'),
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

tasksRouter.post(
  '/:userId/new',
  IdValidator.validate('userId'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.userId;
      const { userId: _, ...taskData } = req.body;
      const result = await TaskController.newTask(taskData, userId);
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

tasksRouter.put(
  '/:taskId',
  IdValidator.validate('taskId'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const taskId = parseInt(req.params.taskId);
      const taskData = req.body;
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
  IdValidator.validate('taskId'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const taskId = req.params.taskId;
      const result = await TaskController.deleteTask(taskId);
      if (result.isSuccess) {
        res.status(204).json();
      } else {
        res.status(404).json(result);
      }
    } catch (error) {
      next(error);
    }
  },
);

tasksRouter.patch(
  '/:taskId/toggle-completion',
  IdValidator.validate('taskId'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await TaskController.toggleCompletion(req.params.taskId);
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

export default tasksRouter;

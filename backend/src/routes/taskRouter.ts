import Express, {
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { TaskController } from '../controllers/TaskController.js';
import { IdValidator } from '../middlewares/IdValidator.js';
import { CreateTaskDTO, UpdateTaskDTO } from '../models/dtos/TaskDTO.js';

interface TypedRequestBody<T> extends Request {
  body: T;
}

const tasksRouter = Express.Router();

tasksRouter.get(
  '/user/:userId',
  IdValidator.validate('userId'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.userId;
      const result = await TaskController.getTasksByUserId(userId);
      res.status(200).json(result);
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
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
);

tasksRouter.post(
  '/:userId/new',
  IdValidator.validate('userId') as RequestHandler<
    ParamsDictionary,
    unknown,
    CreateTaskDTO
  >,
  async (
    req: TypedRequestBody<CreateTaskDTO>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const taskData: CreateTaskDTO = {
        title: req.body.title,
        description: req.body.description,
        user_id: req.params.userId,
      };

      const result = await TaskController.newTask(taskData);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },
);

tasksRouter.put(
  '/:taskId',
  IdValidator.validate('taskId') as RequestHandler<
    ParamsDictionary,
    unknown,
    UpdateTaskDTO
  >,
  async (
    req: TypedRequestBody<UpdateTaskDTO>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const taskData: UpdateTaskDTO = {
        id: req.params.taskId,
        title: req.body.title,
        description: req.body.description,
        completed: req.body.completed,
      };

      const result = await TaskController.updateTask(taskData);
      res.status(200).json(result);
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
      res.status(204).json(result);
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
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
);

tasksRouter.get(
  '/stats/:userId',
  IdValidator.validate('userId'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.userId;
      const result = await TaskController.getUserTaskStats(userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
);

export default tasksRouter;

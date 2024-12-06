import { Router, NextFunction } from 'express';
import express from 'express';
import { UserController } from '../controllers/UserController.js';
import { User } from '../models/User.js';

const userRouter = Router();

userRouter.post(
  '/register',
  async (req: express.Request, res: express.Response, next: NextFunction) => {
    const user = req.body as User;

    try {
      const result = await UserController.newUser(user);
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

userRouter.post(
  '/login',
  async (req: express.Request, res: express.Response, next: NextFunction) => {
    const user = req.body as User;
    try {
      const result = await UserController.checkUserAndPassword(user);

      if (result.isSuccess) {
        res.status(200).json(result);
      } else {
        res.status(401).json(result);
      }
    } catch (error) {
      next(error);
    }
  },
);

userRouter.get(
  '/',
  async (req: express.Request, res: express.Response, next: NextFunction) => {
    try {
      const users = await UserController.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  },
);

userRouter.delete(
  '/:id',
  async (req: express.Request, res: express.Response, next: NextFunction) => {
    const userId = req.params.id;
    try {
      const result = await UserController.deleteUser(userId);
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

userRouter.put(
  '/:id',
  async (req: express.Request, res: express.Response, next: NextFunction) => {
    try {
      const user = req.body as User;
      const result = await UserController.updateUser(user);
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

userRouter.get(
  '/:id',
  async (req: express.Request, res: express.Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const result = await UserController.getUserById(id);
      if (result.isSuccess) {
        res.status(200).json(result.data);
      } else {
        res.status(404).json(result);
      }
    } catch (error) {
      next(error);
    }
  },
);

export default userRouter;

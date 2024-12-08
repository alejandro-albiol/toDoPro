import Express, { Request, Response, NextFunction } from 'express';
import { UserController } from '../controllers/UserController.js';
import { IdValidator } from '../middlewares/IdValidator.js';
import { UserValidator } from '../middlewares/userValidator.js';
import { UpdateUserDTO, ChangePasswordDTO } from '../models/dtos/UserDTO.js';

const userRouter = Express.Router();

userRouter.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await UserController.getAllUsers();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
);

userRouter.get(
  '/:userId',
  IdValidator.validate('userId'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.userId;
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

userRouter.post(
  '/register',
  UserValidator.validateRegistration(),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.body;
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
  UserValidator.validateLogin(),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.body;
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

userRouter.put(
  '/profile/:userId',
  IdValidator.validate('userId'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updateData: UpdateUserDTO = {
        id: req.params.userId,
        username: req.body.username,
        email: req.body.email
      };
      
      const result = await UserController.updateUser(updateData);
      if (result.isSuccess) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      next(error);
    }
  }
);

userRouter.post(
  '/change-password/:userId',
  IdValidator.validate('userId'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const passwordData: ChangePasswordDTO = {
        currentPassword: req.body.currentPassword,
        newPassword: req.body.newPassword
      };
      
      const result = await UserController.changePassword(req.params.userId, passwordData);
      if (result.isSuccess) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      next(error);
    }
  }
);

userRouter.delete(
  '/:userId',
  IdValidator.validate('userId'),
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;
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

export default userRouter;

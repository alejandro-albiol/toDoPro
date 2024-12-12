import Express, {
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { UserController } from '../controllers/UserController.js';
import { IdValidator } from '../middlewares/IdValidator.js';
import { UserValidator } from '../middlewares/userValidator.js';
import {
  CreateUserDTO,
  UpdateUserDTO,
  ChangePasswordDTO,
  LoginDTO,
} from '../models/dtos/UserDTO.js';

interface TypedRequestBody<T> extends Request {
  body: T;
}

const userRouter = Express.Router();

userRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await UserController.getAllUsers();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

userRouter.get(
  '/:userId',
  IdValidator.validate('userId'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.userId;
      const result = await UserController.getUserById(id);
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

userRouter.post(
  '/register',
  UserValidator.validateRegistration() as RequestHandler<
    ParamsDictionary,
    unknown,
    CreateUserDTO
  >,
  async (
    req: TypedRequestBody<CreateUserDTO>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const result = await UserController.newUser(req.body);
      res.status(result.isSuccess ? 201 : 400).json(result);
    } catch (error) {
      next(error);
    }
  },
);

userRouter.post(
  '/login',
  UserValidator.validateLogin() as RequestHandler<
    ParamsDictionary,
    unknown,
    LoginDTO
  >,
  async (
    req: TypedRequestBody<LoginDTO>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const result = await UserController.checkUserAndPassword(req.body);
      res.status(result.isSuccess ? 200 : 401).json(result);
    } catch (error) {
      next(error);
    }
  },
);

userRouter.put(
  '/profile/:userId',
  IdValidator.validate('userId') as RequestHandler<
    ParamsDictionary,
    unknown,
    UpdateUserDTO
  >,
  async (
    req: TypedRequestBody<UpdateUserDTO>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const updateData: UpdateUserDTO = {
        id: req.params.userId,
        username: req.body.username,
        email: req.body.email,
      };

      const result = await UserController.updateUser(updateData);
      res.status(result.isSuccess ? 200 : 400).json(result);
    } catch (error) {
      next(error);
    }
  },
);

userRouter.put(
  '/:userId/change-password',
  IdValidator.validate('userId') as RequestHandler<
    ParamsDictionary,
    unknown,
    ChangePasswordDTO
  >,
  UserValidator.validatePasswordChange() as RequestHandler<
    ParamsDictionary,
    unknown,
    ChangePasswordDTO
  >,
  async (
    req: TypedRequestBody<ChangePasswordDTO>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const passwordData: ChangePasswordDTO = {
        userId: req.params.userId,
        currentPassword: req.body.currentPassword,
        newPassword: req.body.newPassword,
      };

      const result = await UserController.changePassword(passwordData);
      res.status(result.isSuccess ? 200 : 400).json(result);
    } catch (error) {
      next(error);
    }
  },
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

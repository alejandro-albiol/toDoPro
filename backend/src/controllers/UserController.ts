import { Request, Response, NextFunction } from 'express';
import { IUserService } from '../interfaces/services/IUserService.js';
import { BaseException } from '../models/exceptions/base/BaseException.js';
import { IUserController } from '../interfaces/controllers/IUserController.js';

export class UserController implements IUserController {
  constructor(private userService: IUserService) {}

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.userService.findById(req.params.id);
      res.status(200).json(user);
    } catch (error) {
      if (error instanceof BaseException) {
        res.status(error.statusCode).json({
          code: error.errorCode,
          message: error.message,
        });
      } else {
        next(error);
      }
    }
  }

  async findByEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.userService.findByEmail(req.params.email);
      res.status(200).json(user);
    } catch (error) {
      if (error instanceof BaseException) {
        res.status(error.statusCode).json({
          code: error.errorCode,
          message: error.message,
        });
      } else {
        next(error);
      }
    }
  }

  async findByUsername(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.userService.findByUsername(req.params.username);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.userService.create(req.body);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof BaseException) {
        res.status(error.statusCode).json({
          code: error.errorCode,
          message: error.message,
        });
      } else {
        next(error);
      }
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.userService.update(req.params.id, req.body);
      res.status(200).json(user);
    } catch (error) {
      if (error instanceof BaseException) {
        res.status(error.statusCode).json({
          code: error.errorCode,
          message: error.message,
        });
      } else {
        next(error);
      }
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await this.userService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      if (error instanceof BaseException) {
        res.status(error.statusCode).json({
          code: error.errorCode,
          message: error.message,
        });
      } else {
        next(error);
      }
    }
  }
}

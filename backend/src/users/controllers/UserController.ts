import { Request, Response, NextFunction } from 'express';
import { IUserService } from '../services/IUserService.js';
import { IUserController } from './IUserController.js';
import { UserNotFoundException } from '../exceptions/UserNotFound.exception.js';
import { UsernameAlreadyExistsException } from '../exceptions/UsernameAlreadyExists.exception.js';
import { EmailAlreadyExistsException } from '../exceptions/EmailAlreadyExists.exception.js';

export class UserController implements IUserController {
  constructor(private userService: IUserService) {}

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.userService.findById(req.params.id);
      res.status(200).json(user);
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        res.status(404).json({
          code: error.errorCode,
          message: 'User not found',
        });
      } else {
        next(error);
      }
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.userService.create(req.body);
      res.status(201).json(user);
    } catch (error) {
      if (
        error instanceof UsernameAlreadyExistsException ||
        error instanceof EmailAlreadyExistsException
      ) {
        res.status(409).json({
          code: error.errorCode,
          message: 'Invalid user',
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
      if (error instanceof UserNotFoundException) {
        res.status(403).json({
          code: error.errorCode,
          message: 'Access denied',
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
      if (error instanceof UserNotFoundException) {
        res.status(403).json({
          code: error.errorCode,
          message: 'Access denied',
        });
      } else {
        next(error);
      }
    }
  }
}

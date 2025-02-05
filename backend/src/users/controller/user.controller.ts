import { Request, Response } from 'express';
import { IUserService } from '../service/i-user.service.js';
import { CreateUserDTO } from '../models/dtos/create-user.dto.js';
import { UpdateUserDTO } from '../models/dtos/update-user.dto.js';
import { UserException } from '../exceptions/base-user.exception.js';
import { IUserController } from './i-user.controller.js';
import { ApiResponse } from '../../shared/responses/api-response.js';
import { UserErrorCodes } from '../exceptions/enums/user-error-codes.enum.js';

export class UserController implements IUserController {
    constructor(private userService: IUserService) {}

    async create(req: Request, res: Response): Promise<void> {
        try {
            const newUser = await this.userService.create(req.body as CreateUserDTO);
            ApiResponse.created(res, newUser);
        } catch (error) {
            if (error instanceof UserException) {
                ApiResponse.error(res, error);
            } else {
                ApiResponse.internalError(res, error);
            }
        }
    }

    async findAll(req: Request, res: Response): Promise<void> {
        try {
            const users = await this.userService.findAll();
            ApiResponse.success(res, users);
        } catch (error) {
            if (error instanceof UserException) {
                ApiResponse.error(res, error);
            } else {
                ApiResponse.internalError(res, error);
            }
        }
    }

    async findById(req: Request, res: Response): Promise<void> {
        try {
            const user = await this.userService.findById(req.params.id);
            if (user) {
                ApiResponse.success(res, user);
            } else {
                ApiResponse.notFound(res, `User with id ${req.params.id} not found`, UserErrorCodes.USER_NOT_FOUND);
            }
        } catch (error) {
            if (error instanceof UserException) {
                ApiResponse.error(res, error);
            } else {
                ApiResponse.internalError(res, error);
            }
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try {
            const updateDto: UpdateUserDTO = {
                id: req.params.id,
                ...req.body
            };
            const updatedUser = await this.userService.update(updateDto);
            ApiResponse.success(res, updatedUser);
        } catch (error) {
            if (error instanceof UserException) {
                ApiResponse.error(res, error);
            } else {
                ApiResponse.internalError(res, error);
            }
        }
    }

    async updatePassword(req: Request, res: Response): Promise<void> {
        try {
            await this.userService.updatePassword(req.params.id, req.body.password);
            ApiResponse.success(res, { message: 'Password updated successfully' });
        } catch (error) {
            if (error instanceof UserException) {
                ApiResponse.error(res, error);
            } else {
                ApiResponse.internalError(res, error);
            }
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            const deleted = await this.userService.delete(req.params.id);
            if (deleted) {
                ApiResponse.success(res, { message: 'User deleted successfully' });
            } else {
                ApiResponse.notFound(res, `User with id ${req.params.id} not found`, UserErrorCodes.USER_NOT_FOUND);
            }
        } catch (error) {
            if (error instanceof UserException) {
                ApiResponse.error(res, error);
            } else {
                ApiResponse.internalError(res, error);
            }
        }
    }
}

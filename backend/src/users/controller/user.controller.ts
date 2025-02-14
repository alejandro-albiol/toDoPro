import { Request, Response } from 'express';
import { IUserService } from '../service/i-user.service.js';
import { CreateUserDTO } from '../models/dtos/create-user.dto.js';
import { UpdateUserDTO } from '../models/dtos/update-user.dto.js';
import { UserException } from '../exceptions/base-user.exception.js';
import { IUserController } from './i-user.controller.js';
import { ApiResponse } from '../../shared/responses/api-response.js';
import { UserErrorCodes } from '../exceptions/enums/user-error-codes.enum.js';
import { UserNotFoundException } from '../exceptions/user-not-found.exception.js';

export class UserController implements IUserController {
    constructor(private readonly userService: IUserService) {}

    async create(req: Request, res: Response): Promise<void> {
        try {
            const dto: CreateUserDTO = req.body;
            const newUser = await this.userService.create(dto);
            ApiResponse.created(res, newUser);
        } catch (error) {
            this.handleError(res, error);
        }
    }

    async findAll(req: Request, res: Response): Promise<void> {
        try {
            const users = await this.userService.findAll();
            ApiResponse.success(res, users);
        } catch (error) {
            this.handleError(res, error);
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
            this.handleError(res, error);
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
            this.handleError(res, error);
        }
    }

    async updatePassword(req: Request, res: Response): Promise<void> {
        try {
            const { password } = req.body;
            const result = await this.userService.updatePassword(req.params.id, password);
            ApiResponse.success(res, { message: 'Password updated successfully' });
        } catch (error) {
            this.handleError(res, error);
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            await this.userService.delete(req.params.id);
            ApiResponse.success(res, { message: 'User deleted successfully' });
        } catch (error) {
            this.handleError(res, error);
        }
    }

    private handleError(res: Response, error: unknown): void {
        if (error instanceof UserException) {
            ApiResponse.error(res, error, error instanceof UserNotFoundException ? 404 : 400);
        } else {
            ApiResponse.error(res, error);
        }
    }
}

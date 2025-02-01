import { IUserService } from '../service/i-user.service.js';
import { CreateUserDTO } from '../models/dtos/create-user.dto.js';
import { UpdateUserDTO } from '../models/dtos/update-user.dto.js';
import { UserException } from '../exceptions/base-user.exception.js';
import { IUserController } from './i-user.controller.js';
import { InvalidUserDataException } from '../exceptions/invalid-user-data.exception.js';
import { User } from '../models/entities/user.entity.js';
import { UserNotFoundException } from '../exceptions/user-not-found.exception.js';
import { UserCreationFailedException } from '../exceptions/user-creation-failed.exception.js';
import { UpdatedUserDTO } from '../models/dtos/updated-user.dto.js';
import { UserOperationException } from '../exceptions/user-operation.exception.js';

export class UserController implements IUserController {
  constructor(private userService: IUserService) {}
  
  async create(newUser: CreateUserDTO): Promise<User> {
    try {
        const newUserDto = await this.toCreateUserDto(newUser);
        const createdUser = await this.userService.create(newUserDto);
        if (!createdUser) {
            throw new UserCreationFailedException('Failed to create user');
        }
        return createdUser;
    } catch (error) {
        if (error instanceof UserException) {
            throw error;
        }
        throw new UserCreationFailedException('Failed to create user');
    }
  }

  async findById(id: string): Promise<User> {
    if (!id) {
        throw new InvalidUserDataException('User ID is required');
    }
    try {
        const user = await this.userService.findById(id);
        if (!user) {
            throw new UserNotFoundException(id);
        }
        return user;
    } catch (error) {
        if (error instanceof UserException) {
            throw error;
        }
        throw new UserOperationException('An unknown error occurred');
    }
  }

  async update(userToUpdate: UpdateUserDTO): Promise<UpdatedUserDTO> {
    try {
        const userDto = await this.toUpdateUserDto(userToUpdate);
        return await this.userService.update(userDto);
    } catch (error) {
        if (error instanceof UserException) {
            throw error;
        }
        throw new UserOperationException('An unknown error occurred');
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
        return await this.userService.delete(id);
    } catch (error) {
        if (error instanceof UserException) {
            throw error;
        }
        throw new UserOperationException('An unknown error occurred');
    }
  }

  private async toCreateUserDto(newUser: CreateUserDTO): Promise<CreateUserDTO> {
    return {
        username: newUser.username?.toLowerCase(),
        email: newUser.email?.toLowerCase(),
        password: newUser.password
    };
  }

  private async toUpdateUserDto(userToUpdate: UpdateUserDTO): Promise<UpdateUserDTO> {
    return {
        id: userToUpdate.id,
        username: userToUpdate.username?.toLowerCase(),
        email: userToUpdate.email?.toLowerCase(),
    };
  }
}

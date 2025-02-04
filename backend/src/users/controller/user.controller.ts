import { IUserService } from '../service/i-user.service.js';
import { CreateUserDTO } from '../models/dtos/create-user.dto.js';
import { UpdateUserDTO } from '../models/dtos/update-user.dto.js';
import { UserException } from '../exceptions/base-user.exception.js';
import { IUserController } from './i-user.controller.js';
import { User } from '../models/entities/user.entity.js';
import { UserNotFoundException } from '../exceptions/user-not-found.exception.js';
import { UserCreationFailedException } from '../exceptions/user-creation-failed.exception.js';
import { UserOperationException } from '../exceptions/user-operation.exception.js';
import { EmailAlreadyExistsException } from '../exceptions/email-already-exists.exception.js';
import { UsernameAlreadyExistsException } from '../exceptions/username-already-exists.exception.js';

export class UserController implements IUserController {
  constructor(private userService: IUserService) {}
  
  async create(newUser: CreateUserDTO): Promise<User> {
    try {
        // Transform and sanitize input
        const sanitizedUser = await this.toCreateUserDto(newUser);

        // Call service layer
        const createdUser = await this.userService.create(sanitizedUser);

        // Return user without sensitive data
        const { password, ...userWithoutPassword } = createdUser;
        return userWithoutPassword as User;

    } catch (error) {
        // Let the error handler middleware handle specific exceptions
        if (error instanceof UserException ||
            error instanceof EmailAlreadyExistsException ||
            error instanceof UsernameAlreadyExistsException) {
            throw error;
        }

        // Log unexpected errors
        console.error('Unexpected error during user creation:', error);
        throw new UserCreationFailedException('An unexpected error occurred while creating the user');
    }
  }

  async findById(id: string): Promise<User> {
    try {
        const user = await this.userService.findById(id);
        if (!user) {
            throw new UserNotFoundException(id);
        }
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword as User;
    } catch (error) {
        if (error instanceof UserException) {
            throw error;
        }
        throw new UserOperationException('An unknown error occurred');
    }
  }

  async update(userToUpdate: UpdateUserDTO): Promise<UpdateUserDTO> {
    try {
        const userDto = await this.toUpdateUserDto(userToUpdate);
        const updatedUser = await this.userService.update(userDto);
        return updatedUser as UpdateUserDTO;
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

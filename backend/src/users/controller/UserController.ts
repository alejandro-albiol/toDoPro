import { IUserService } from '../service/IUserService.js';
import { CreateUserDTO } from '../models/dtos/CreateUserDTO.js';
import { UpdateUserDTO } from '../models/dtos/UpdateUserDTO.js';
import { UserException } from '../exceptions/base-user.exception.js';
import { DataBaseException } from '../../shared/exceptions/DataBaseException.js';
import { IUserController } from './IUserController.js';
import { DataBaseErrorCode } from '../../shared/exceptions/enums/DataBaseErrorCode.enum.js';
import { InvalidUserDataException } from '../exceptions/invalid-user-data.exception.js';
import { User } from '../models/entities/User.js';
import { UserNotFoundException } from '../exceptions/user-not-found.exception.js';

export class UserController implements IUserController {
  constructor(private userService: IUserService) {}
  
  async create(newUser: CreateUserDTO): Promise<User> {
    try {
        if (!newUser) {
            throw new InvalidUserDataException('User data is required');
        }
        const newUserDto = await this.toCreateUserDto(newUser);
        const user = await this.userService.create(newUserDto);
        if (!user) {
            throw new InvalidUserDataException('User not found');
        }
        return user;
    } catch (error) {
        if (error instanceof UserException || error instanceof DataBaseException || error instanceof SyntaxError) {
            throw error;
        }
        console.error(error);
        throw new InvalidUserDataException('An unknown error occurred');
    }
  }

  async findById(id: string): Promise<User> {
    try {
        console.log('Controller - Finding user with id:', id);
        const user = await this.userService.findById(id);
        console.log('Controller - User found:', user);
        if (!user) {
            throw new UserNotFoundException(id);
        }
        return user;
    } catch (error) {
        console.log('Controller - Error caught:', error);
        if (error instanceof UserException || error instanceof DataBaseException) {
            throw error;
        }
        console.error('Controller - Unknown error:', error);
        throw new DataBaseException(
            'An unknown error occurred',
            DataBaseErrorCode.UNKNOWN_ERROR
        );
    }
  }

  async update(userToUpdate: UpdateUserDTO) {
    try {
      const userDto = await this.toUpdateUserDto(userToUpdate);
      const userUpdatedDto = await this.userService.update(userDto);
      return userUpdatedDto;
    } catch (error) {
      if (error instanceof UserException || error instanceof DataBaseException) {
        throw error;
      }
      console.error(error);
      throw error;
    }
  }

  async updatePassword(id: string, password: string) {
    try {
      await this.userService.updatePassword(id, password);
    } catch (error) {
      if (error instanceof UserException || error instanceof DataBaseException) {
        throw error;
      }
      console.error(error);
      throw error;
    }
  }

  async delete(id: string) {
    try {
      await this.userService.delete(id);
      return;
    } catch (error) {
      if (error instanceof UserException || error instanceof DataBaseException) {
        throw error;
      }
      console.error(error);
      throw error;
    }
  }

  
  private async toCreateUserDto(newUser: CreateUserDTO): Promise<CreateUserDTO> {
    try {
        return {
            username: newUser.username?.toLowerCase(),
            email: newUser.email?.toLowerCase(),
            password: newUser.password
        };
    } catch (error) {
        throw new InvalidUserDataException('Invalid input data type');
    }
  }

  private async toUpdateUserDto(userToUpdate: UpdateUserDTO): Promise<UpdateUserDTO> {
    return {
      id: userToUpdate.id,
      username: userToUpdate.username?.toLowerCase(),
      email: userToUpdate.email?.toLowerCase(),
    };
  }
}

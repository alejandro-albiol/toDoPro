import { IUserService } from '../service/IUserService.js';
import { CreateUserDTO } from '../models/dtos/CreateUserDTO.js';
import { UpdateUserDTO } from '../models/dtos/UpdateUserDTO.js';
import { UserException } from '../exceptions/UserException.js';
import { DataBaseException } from '../../shared/exceptions/DataBaseException.js';
import { IUserController } from './IUserController.js';
import { DataBaseErrorCode } from '../../shared/exceptions/enums/DataBaseErrorCode.enum.js';

export class UserController implements IUserController {
  constructor(private userService: IUserService) {}
  
  async create(newUser: CreateUserDTO) {
    const newUserDto = await this.toCreateUserDto(newUser);
    return await this.userService.create(newUserDto);
  }

  async findById(id: string) {
    try {
      const user = await this.userService.findById(id);
      return user;
    } catch (error) {
      if (error instanceof UserException || error instanceof DataBaseException) {
        throw error;
      }
      console.error(error);
      throw error;
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

  
  private async toCreateUserDto(newUser: any): Promise<CreateUserDTO> {
    try {
        return {
            username: newUser.username?.toLowerCase(),
            email: newUser.email?.toLowerCase(),
            password: newUser.password
        };
    } catch (error) {
        throw new DataBaseException(
            'Invalid input data type',
            DataBaseErrorCode.INVALID_INPUT
        );
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

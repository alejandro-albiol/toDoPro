import { IUserService } from '../service/IUserService.js';
import { CreateUserDTO, UpdateUserDTO } from '../models/dtos/UserDTO.js';
import { UserException } from '../exceptions/UserException.js';
import { DataBaseException } from '../../shared/exceptions/DataBaseException.js';
import { IUserController } from './IUserController.js';

export class UserController implements IUserController {
  constructor(private userService: IUserService) {}
  
  async create(newUser: CreateUserDTO) {
    try {
      const newUserDto = await this.toCreateUserDto(newUser);
      const user = await this.userService.create(newUserDto);
      return user;
    } catch (error) {
      if (error instanceof UserException || error instanceof DataBaseException) {
        throw error;
      }
      console.error(error);
      throw error;
    }
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
      return;
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
    return {
      username: newUser.username.toLowerCase(),
      email: newUser.email.toLowerCase(),
      password: newUser.password,
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

import { IUserService } from './IUserService.js';
import { CreateUserDTO, UpdateUserDTO, UserUpdatedDTO } from '../models/dtos/UserDTO.js';
import { User } from '../models/entities/User.js';
import { UserRepository } from '../repository/UserRepository.js';
import { UserNotFoundException } from '../exceptions/UserNotFound.exception.js';
import { EmailAlreadyExistsException } from '../exceptions/EmailAlreadyExists.exception.js';
import { UsernameAlreadyExistsException } from '../exceptions/UsernameAlreadyExists.exception.js';
import { DataBaseErrorCode } from '../../shared/exceptions/enums/DataBaseErrorCode.enum.js';
import { DataBaseException } from '../../shared/exceptions/DataBaseException.js';
import { HashServices } from '../../shared/services/HashServices.js';

export class UserService implements IUserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async create(userData: CreateUserDTO): Promise<User> {
    try {
      const hashedPassword = await HashServices.hashPassword(userData.password);
      const userWithHashedPassword = {
        ...userData,
        password: hashedPassword,
      };
      return await this.userRepository.create(userWithHashedPassword);
    } catch (error) {
      if (error instanceof DataBaseException) {
        if (error.code === DataBaseErrorCode.UNIQUE_VIOLATION) {
          if (error.metadata?.constraint?.includes('email')) {
            throw new EmailAlreadyExistsException(userData.email);
          }
          if (error.metadata?.constraint?.includes('username')) {
            throw new UsernameAlreadyExistsException(userData.username);
          }
        }
      }
      throw new DataBaseException('Error creating user', DataBaseErrorCode.UNKNOWN_ERROR);
    }
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UserNotFoundException(id);
    }
    return user;
  }

  async update(userData: UpdateUserDTO): Promise<UserUpdatedDTO> {
    const user = await this.userRepository.update(userData);
    if (!user) {
      throw new UserNotFoundException(userData.id);
    }
    return user;
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.userRepository.delete(id);
      return true;
    } catch (error) {
      throw new UserNotFoundException(id);
    }
  }
}

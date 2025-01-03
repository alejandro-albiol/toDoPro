import { IUserService } from './IUserService.js';
import { CreateUserDTO } from '../models/dtos/CreateUserDTO.js';
import { UpdateUserDTO } from '../models/dtos/UpdateUserDTO.js';
import { UserUpdatedDTO } from '../models/dtos/UpdatedUserDTO.js';
import { User } from '../models/entities/User.js';
import { UserRepository } from '../repository/UserRepository.js';
import { UserNotFoundException } from '../exceptions/UserNotFound.exception.js';
import { EmailAlreadyExistsException } from '../exceptions/EmailAlreadyExists.exception.js';
import { UsernameAlreadyExistsException } from '../exceptions/UsernameAlreadyExists.exception.js';
import { DataBaseErrorCode } from '../../shared/exceptions/enums/DataBaseErrorCode.enum.js';
import { DataBaseException } from '../../shared/exceptions/DataBaseException.js';
import { HashServices } from '../../shared/services/HashServices.js';
import { InvalidUserDataException } from '../exceptions/InvalidUserDataException.js';

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
    } catch (error: any) {
      console.log('Service error type:', error.constructor.name);
      console.log('Service error code:', error.code);
      console.log('Service error detail:', error.detail);
      console.log('Service error constraint:', error.metadata?.constraint);

      if (error instanceof DataBaseException && error.code === DataBaseErrorCode.UNIQUE_VIOLATION) {
        if (error.metadata?.constraint?.includes('email')) {
          throw new EmailAlreadyExistsException(userData.email);
        }
        if (error.metadata?.constraint?.includes('username')) {
          throw new UsernameAlreadyExistsException(userData.username);
        }
      }
      if (error instanceof DataBaseException && error.code === DataBaseErrorCode.INVALID_INPUT) {
        throw new InvalidUserDataException('Invalid data type for user fields');
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
//TODO: MOVE TO SHARED FOLDER (AUTHENTICATION)??
  async updatePassword(id: string, password: string): Promise<void> {
    const hashedPassword = await HashServices.hashPassword(password);
    await this.userRepository.updatePassword(id, hashedPassword);
  }

  async delete(id: string): Promise<void> {
    try {
      await this.userRepository.delete(id);
    } catch (error) {
      throw new UserNotFoundException(id);
    }
  }
}

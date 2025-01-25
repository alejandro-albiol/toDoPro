import { IUserService } from './i-user-service.js';
import { CreateUserDTO } from '../models/dtos/create-user.dto.js';
import { UpdateUserDTO } from '../models/dtos/update-user.dto.js';
import { UpdatedUserDTO } from '../models/dtos/updated-user.dto.js';
import { User } from '../models/entities/user.entity.js';
import { UserRepository } from '../repository/user-repository.js';
import { UserNotFoundException } from '../exceptions/user-not-found.exception.js';
import { EmailAlreadyExistsException } from '../exceptions/email-already-exists.exception.js';
import { UsernameAlreadyExistsException } from '../exceptions/username-already-exists.exception.js';
import { DataBaseErrorCode } from '../../shared/models/exceptions/enums/data-base-error-code.enum.js';
import { DataBaseException } from '../../shared/models/exceptions/data-base.exception.js';
import { HashService } from '../../shared/services/hash-service.js';
import { InvalidUserDataException } from '../exceptions/invalid-user-data.exception.js';
import { UserCreationFailedException } from '../exceptions/user-creation-failed.exception.js';

export class UserService implements IUserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async create(newUser: CreateUserDTO): Promise<User> {
    try {
      const hashedPassword = await HashService.hashPassword(newUser.password);
      const userWithHashedPassword = { ...newUser, password: hashedPassword };
      const user = await this.userRepository.create(userWithHashedPassword);
      if (!user) {
        throw new UserCreationFailedException('Failed to create user');
      }
      return user;
    } catch (error) {
      if (error instanceof UserCreationFailedException) {
        throw error;
      }
      if (error instanceof DataBaseException) {
        if (error.code === DataBaseErrorCode.UNIQUE_VIOLATION) {
          const errorMessage = error.message.toLowerCase();
          if (errorMessage.includes('email')) {
            throw new EmailAlreadyExistsException(newUser.email || 'unknown');
          }
          if (errorMessage.includes('username')) {
            throw new UsernameAlreadyExistsException(newUser.username || 'unknown');
          }
        }
        if (error.code === DataBaseErrorCode.INVALID_INPUT) {
          throw new InvalidUserDataException('Invalid user data format');
        }
      }
      throw new DataBaseException('Error creating user', DataBaseErrorCode.UNKNOWN_ERROR);
    }
  }

  async findById(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findById(id);
      if (!user) {
        throw new UserNotFoundException(id);
      }
      return user;
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw error;
      }
      if (error instanceof DataBaseException) {
        if (error.code === DataBaseErrorCode.NOT_FOUND) {
          throw new UserNotFoundException(id);
        }
        if (error.code === DataBaseErrorCode.INVALID_INPUT) {
          throw new InvalidUserDataException('Invalid user ID format');
        }
        throw error;
      }
      throw new DataBaseException('Error finding user', DataBaseErrorCode.UNKNOWN_ERROR);
    }
  }

  async findByEmail(email: string): Promise<User> {
    try {
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        throw new UserNotFoundException(email);
      }
      return user;
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw error;
      }
      if (error instanceof DataBaseException) {
        if (error.code === DataBaseErrorCode.NOT_FOUND) {
          throw new UserNotFoundException(email);
        }
        if (error.code === DataBaseErrorCode.INVALID_INPUT) {
          throw new InvalidUserDataException('Invalid user email format');
        }
      }
      throw new DataBaseException('Error finding user by email', DataBaseErrorCode.UNKNOWN_ERROR);
    }
  }

  async update(userData: UpdateUserDTO): Promise<UpdatedUserDTO> {
    try {
      const user = await this.userRepository.update(userData);
      if (!user) {
        throw new UserNotFoundException(userData.id);
      }
      return user;
    } catch (error) {
      if (error instanceof DataBaseException) {
        if (error.code === DataBaseErrorCode.UNIQUE_VIOLATION) {
          const errorMessage = error.message.toLowerCase();
          if (errorMessage.includes('email')) {
            throw new EmailAlreadyExistsException(userData.email || 'unknown');
          }
          if (errorMessage.includes('username')) {
            throw new UsernameAlreadyExistsException(userData.username || 'unknown');
          }
        }
        if (error.code === DataBaseErrorCode.NOT_FOUND) {
          throw new UserNotFoundException(userData.id);
        }
        if (error.code === DataBaseErrorCode.INVALID_INPUT) {
          throw new InvalidUserDataException('Invalid user data format');
        }
      }
      throw new DataBaseException('Error updating user', DataBaseErrorCode.UNKNOWN_ERROR);
    }
  }

  async updatePassword(id: string, password: string): Promise<void> {
    try {
      const hashedPassword = await HashService.hashPassword(password);
      await this.userRepository.updatePassword(id, hashedPassword);
    } catch (error) {
      if (error instanceof DataBaseException) {
        if (error.code === DataBaseErrorCode.NOT_FOUND) {
          throw new UserNotFoundException(id);
        }
        if (error.code === DataBaseErrorCode.INVALID_INPUT) {
          throw new InvalidUserDataException('Invalid password format');
        }
      }
      throw new DataBaseException('Error updating password', DataBaseErrorCode.UNKNOWN_ERROR);
    }
  }

  async delete(id: string): Promise<null> {
    try {
      await this.userRepository.delete(id);
      return null;
    } catch (error) {
      if (error instanceof DataBaseException) {
        if (error.code === DataBaseErrorCode.NOT_FOUND) {
          throw new UserNotFoundException(id);
        }
        if (error.code === DataBaseErrorCode.INVALID_INPUT) {
          throw new InvalidUserDataException('Invalid user ID format');
        }
      }
      throw new DataBaseException('Error deleting user', DataBaseErrorCode.UNKNOWN_ERROR);
    }
  }
}

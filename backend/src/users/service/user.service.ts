import { IUserService } from './i-user.service.js';
import { CreateUserDTO } from '../models/dtos/create-user.dto.js';
import { UpdateUserDTO } from '../models/dtos/update-user.dto.js';
import { UpdatedUserDTO } from '../models/dtos/updated-user.dto.js';
import { User } from '../models/entities/user.entity.js';
import { UserRepository } from '../repository/user.repository.js';
import { UserNotFoundException } from '../exceptions/user-not-found.exception.js';
import { EmailAlreadyExistsException } from '../exceptions/email-already-exists.exception.js';
import { UsernameAlreadyExistsException } from '../exceptions/username-already-exists.exception.js';
import { DataBaseErrorCode } from '../../shared/models/exceptions/enums/data-base-error-code.enum.js';
import { DataBaseException } from '../../shared/models/exceptions/database.exception.js';
import { HashService } from '../../shared/services/hash.service.js';
import { InvalidUserDataException } from '../exceptions/invalid-user-data.exception.js';
import { UserCreationFailedException } from '../exceptions/user-creation-failed.exception.js';
import { UserException } from '../exceptions/base-user.exception.js';
import { UserOperationException } from '../exceptions/user-operation.exception.js';

export class UserService implements IUserService {
  constructor(private userRepository: UserRepository) {}

  async create(newUser: CreateUserDTO): Promise<User> {
    try {
      const existingEmail = await this.userRepository.findByEmail(newUser.email);
      if (existingEmail) {
        throw new EmailAlreadyExistsException(newUser.email);
      }
      
      const existingUsername = await this.userRepository.findByUsername(newUser.username);
      if (existingUsername) {
        throw new UsernameAlreadyExistsException(newUser.username);
      }

      const hashedPassword = await HashService.hashPassword(newUser.password);
      return await this.userRepository.create({
        ...newUser,
        password: hashedPassword
      });
    } catch (error) {
      if (error instanceof UserException) {
        throw error;
      }
      if (error instanceof DataBaseException) {
        if (error.code === DataBaseErrorCode.UNIQUE_VIOLATION) {
          if (error.message.includes('email')) {
            throw new EmailAlreadyExistsException(newUser.email);
          }
          if (error.message.includes('username')) {
            throw new UsernameAlreadyExistsException(newUser.username);
          }
        }
        throw new UserCreationFailedException('Database error while creating user');
      }
      throw new UserCreationFailedException('Failed to create user');
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
        if (error.code === DataBaseErrorCode.INVALID_INPUT) {
          throw new InvalidUserDataException('Invalid user ID format');
        }
        throw new UserNotFoundException(id);
      }
      throw new UserNotFoundException(id);
    }
  }

  async findByUsername(username: string): Promise<User> {
    try {
      const user = await this.userRepository.findByUsername(username);
      if (!user) {
        throw new UserNotFoundException(username);
      }
      return user;
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw error;
      }
      if (error instanceof DataBaseException) {
        if (error.code === DataBaseErrorCode.INVALID_INPUT) {
          throw new InvalidUserDataException('Invalid user username format');
        }
        if (error.code === DataBaseErrorCode.NOT_FOUND) {
          throw new UserNotFoundException(username);
        }
      }
      throw new DataBaseException('Error finding user by username', DataBaseErrorCode.UNKNOWN_ERROR);
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
        if (error.code === DataBaseErrorCode.INVALID_INPUT) {
          throw new InvalidUserDataException('Invalid user email format');
        }
        if (error.code === DataBaseErrorCode.NOT_FOUND) {
          throw new UserNotFoundException(email);
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
            throw new EmailAlreadyExistsException(userData.email ?? 'unknown');
          }
          if (errorMessage.includes('username')) {
            throw new UsernameAlreadyExistsException(userData.username ?? 'unknown');
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

  async delete(id: string): Promise<boolean> {
    try {
      const deleted = await this.userRepository.delete(id);
      if (!deleted) {
        throw new UserNotFoundException(id);
      }
      return deleted;
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw error;
      }
      if (error instanceof DataBaseException) {
        if (error.code === DataBaseErrorCode.FOREIGN_KEY_VIOLATION) {
          throw new UserOperationException('Cannot delete user with existing references');
        }
        if (error.code === DataBaseErrorCode.INVALID_INPUT) {
          throw new InvalidUserDataException('Invalid user ID format');
        }
        throw new UserNotFoundException(id);
      }
      throw new UserOperationException('Error deleting user');
    }
  }
}

import { IUserService } from './IUserService.js';
import { CreateUserDTO, UpdateUserDTO } from '../models/dtos/UserDTO.js';
import { User } from '../models/entities/User.js';
import { UserRepository } from '../repository/UserRepository.js';
import { UserNotFoundException } from '../exceptions/UserNotFound.exception.js';
import { EmailAlreadyExistsException } from '../exceptions/EmailAlreadyExists.exception.js';
import { UsernameAlreadyExistsException } from '../exceptions/UsernameAlreadyExists.exception.js';

export class UserServices implements IUserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UserNotFoundException(id);
    }
    return user;
  }

  async create(userData: CreateUserDTO): Promise<User> {
    const existingEmail = await this.userRepository.findByEmail(userData.email);
    if (existingEmail) {
      throw new EmailAlreadyExistsException(userData.email);
    }
    const existingUsername = await this.userRepository.findByUsername(
      userData.username,
    );
    if (existingUsername) {
      throw new UsernameAlreadyExistsException(userData.username);
    }
    return await this.userRepository.create(userData);
  }

  async update(id: string, userData: UpdateUserDTO): Promise<User> {
    const user = await this.userRepository.update(id, userData);
    if (!user) {
      throw new UserNotFoundException(id);
    }
    return user;
  }

  async delete(id: string): Promise<boolean> {
    const isDeleted = await this.userRepository.delete(id);
    if (!isDeleted) {
      throw new UserNotFoundException(id);
    }
    return isDeleted;
  }
}

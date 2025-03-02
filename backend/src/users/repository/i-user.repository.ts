import { CreateUserDTO } from '../models/dtos/create-user.dto.js';
import { UpdateUserDTO } from '../models/dtos/update-user.dto.js';
import { User } from '../models/entities/user.entity.js';
import { IBaseRepository } from '../../shared/models/interfaces/base/i-repository.js';

export interface IUserRepository
  extends IBaseRepository<User, CreateUserDTO, UpdateUserDTO> {
  create(dto: CreateUserDTO): Promise<Partial<User>>;
  findByUsername(username: string): Promise<Partial<User> | null>;
  findByEmail(email: string): Promise<Partial<User> | null>;
  updatePassword(id: string, password: string): Promise<void>;
  getPasswordByUsername(username: string): Promise<string | null>;
}

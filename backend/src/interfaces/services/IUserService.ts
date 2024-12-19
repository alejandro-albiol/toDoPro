import { CreateUserDTO, UpdateUserDTO } from '../dtos/user/UserLoginDto.js';
import { User } from '../../models/entities/User.js';

export interface IUserService {
  findById(id: string): Promise<User>;
  findByEmail(email: string): Promise<User>;
  findByUsername(username: string): Promise<User>;
  create(userData: CreateUserDTO): Promise<User>;
  update(id: string, userData: UpdateUserDTO): Promise<User>;
  delete(id: string): Promise<boolean>;
}

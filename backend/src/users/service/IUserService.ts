import { CreateUserDTO, UpdateUserDTO, UserUpdatedDTO } from '../models/dtos/UserDTO.js';
import { User } from '../models/entities/User.js';

export interface IUserService {
  findById(id: string): Promise<User>;
  create(userData: CreateUserDTO): Promise<User>;
  update(userData: UpdateUserDTO): Promise<UserUpdatedDTO>;
  delete(id: string): Promise<boolean>;
}

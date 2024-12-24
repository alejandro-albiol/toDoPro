import { CreateUserDTO, UpdateUserDTO } from "../models/dtos/UserDTO";
import { User } from "../models/entities/User";

export interface IUserRepository{
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  create(user: CreateUserDTO): Promise<User>;
  update(updatedUser: UpdateUserDTO): Promise<User>;
  delete(id: string): Promise<void>;
}
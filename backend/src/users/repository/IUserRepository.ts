import { CreateUserDTO, UpdateUserDTO } from "../models/dtos/UserDTO";
import { User } from "../models/entities/User";
import { IBaseRepository } from "../../shared/interfaces/base/IBaseRepository";

export interface IUserRepository extends IBaseRepository<User, CreateUserDTO, UpdateUserDTO> {
  findByUsername(username: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  updatePassword(id: string, password: string): Promise<void>;
}
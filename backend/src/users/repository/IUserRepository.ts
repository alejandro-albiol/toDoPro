import { CreateUserDTO } from "../models/dtos/CreateUserDTO.js";
import { UpdateUserDTO } from "../models/dtos/UpdateUserDTO.js";
import { User } from "../models/entities/User.js";
import { IBaseRepository } from "../../shared/interfaces/base/IBaseRepository.js";

export interface IUserRepository extends IBaseRepository<User, CreateUserDTO, UpdateUserDTO> {
  findByUsername(username: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  updatePassword(id: string, password: string): Promise<void>;
}
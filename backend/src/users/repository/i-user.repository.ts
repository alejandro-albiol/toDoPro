import { CreateUserDTO } from "../models/dtos/create-user.dto.js";
import { UpdateUserDTO } from "../models/dtos/update-user.dto.js";
import { User } from "../models/entities/user.entity.js";
import { IBaseRepository } from "../../shared/models/interfaces/base/i-repository.js";

export interface IUserRepository extends IBaseRepository<User, CreateUserDTO, UpdateUserDTO> {
  findByUsername(username: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  updatePassword(id: string, password: string): Promise<void>;
}
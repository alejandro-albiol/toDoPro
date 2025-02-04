import { CreateUserDTO } from "../models/dtos/create-user.dto.js";
import { UpdateUserDTO } from "../models/dtos/update-user.dto.js";
import { User } from "../models/entities/user.entity.js";
import { IBaseService } from "../../shared/models/interfaces/base/i-service.js";

export interface IUserService extends IBaseService<User, CreateUserDTO, UpdateUserDTO> {
  updatePassword(id: string, password: string): Promise<void>;
  findByEmail(email: string): Promise<User>;
}
import { CreateUserDTO } from "../models/dtos/CreateUserDTO.js";
import { UpdateUserDTO } from "../models/dtos/UpdateUserDTO.js";
import { User } from "../models/entities/User.js";
import { IBaseService } from "../../shared/interfaces/base/IBaseService.js";
import { UserUpdatedDTO } from "../models/dtos/UpdatedUserDTO.js";

export interface IUserService extends IBaseService<User, CreateUserDTO, UpdateUserDTO, UserUpdatedDTO> {
  updatePassword(id: string, password: string): Promise<void>;
}
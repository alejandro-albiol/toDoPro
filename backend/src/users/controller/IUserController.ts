import { IBaseController } from "../../shared/interfaces/base/IBaseController.js";
import { User } from "../models/entities/User.js";
import { CreateUserDTO } from "../models/dtos/CreateUserDTO.js";
import { UpdateUserDTO } from "../models/dtos/UpdateUserDTO.js";
import { UpdatedUserDTO } from "../models/dtos/UpdatedUserDTO.js";

export interface IUserController extends IBaseController<User, CreateUserDTO, UpdateUserDTO, UpdatedUserDTO> {
  updatePassword(id: string, password: string): Promise<void>;
}
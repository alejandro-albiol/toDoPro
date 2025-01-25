import { IBaseController } from "../../shared/models/interfaces/base/i-base-controller.js";
import { User } from "../models/entities/user.entity.js";
import { CreateUserDTO } from "../models/dtos/create-user.dto.js";
import { UpdateUserDTO } from "../models/dtos/update-user.dto.js";
import { UpdatedUserDTO } from "../models/dtos/updated-user.dto.js";

export interface IUserController extends IBaseController<User, CreateUserDTO, UpdateUserDTO, UpdatedUserDTO> {
  updatePassword(id: string, password: string): Promise<void>;
}
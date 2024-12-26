import { IBaseController } from "../../shared/interfaces/base/IBaseController.js";
import { CreateUserDTO, UpdateUserDTO, UserUpdatedDTO } from "../models/dtos/UserDTO.js";
import { User } from "../models/entities/User.js";

export interface IUserController extends IBaseController<User, CreateUserDTO, UpdateUserDTO, UserUpdatedDTO> {
  updatePassword(id: string, password: string): Promise<void>;
}
import { CreateUserDTO, UpdateUserDTO, UserUpdatedDTO } from "../models/dtos/UserDTO.js";
import { User } from "../models/entities/User.js";

export interface IUserController {
  create(newUser: CreateUserDTO): Promise<User>;
  findById(id: string): Promise<User>;
  update(userData: UpdateUserDTO): Promise<UserUpdatedDTO>;
  delete(id: string): Promise<void>;
}
import { IBaseService } from '../../shared/interfaces/base/IBaseService.js';
import { CreateUserDTO, UpdateUserDTO, UserUpdatedDTO } from '../models/dtos/UserDTO.js';
import { User } from '../models/entities/User.js';

export interface IUserService extends IBaseService<User, CreateUserDTO, UpdateUserDTO, UserUpdatedDTO> {
  updatePassword(id: string, password: string): Promise<void>;
}

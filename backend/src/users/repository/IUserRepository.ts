import { IBaseRepository } from '../../shared/interfaces/base/IBaseRepository.js';
import { IEmailSearchable } from './IEmailSearchable.js';
import { IUsernameSearchable } from './IUsernameSearchable.js';
import { CreateUserDTO } from '../models/dtos/UserDTO.js';
import { User } from "../models/entities/User.js";

export interface IUserRepository
  extends IBaseRepository<User, CreateUserDTO>,
    IEmailSearchable<User>,
    IUsernameSearchable<User> {}

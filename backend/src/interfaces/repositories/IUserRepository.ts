import { User } from '../../models/entities/User.js';
import { IBaseRepository } from './base/IBaseRepository.js';
import { IEmailSearchable } from './base/IEmailSearchable.js';
import { IUsernameSearchable } from './base/IUsernameSearchable.js';
import { CreateUserDto } from '../../interfaces/dtos/user/CreateUserDto.js';

export interface IUserRepository
  extends IBaseRepository<User, CreateUserDto>,
    IEmailSearchable<User>,
    IUsernameSearchable<User> {}

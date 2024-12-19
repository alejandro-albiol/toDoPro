import { IUserService } from "../interfaces/services/IUserService.js";
import { CreateUserDTO, UpdateUserDTO } from "../models/dtos/UserDTO.js";
import { User } from "../models/entities/User.js";
import { EmailConflictException } from "../models/exceptions/conflict/user/EmailConflictException.js";
import { UserConflictException } from "../models/exceptions/conflict/user/UserConflictException.js";
import { UsernameConflictException } from "../models/exceptions/conflict/user/UsernameConflictException.js";
import { UserNotFoundException } from "../models/exceptions/notFound/user/UserNotFoundException.js";
import { UserRepository } from "../repositories/UserRepository.js";

export class UserServices implements IUserService {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    async findById(id: string): Promise<User> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new UserNotFoundException(id);
        }
        return user;
    }   

    async findByEmail(email: string): Promise<User> {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new UserNotFoundException(email);
        }
        return user;
    }

    async findByUsername(username: string): Promise<User> {
        const user = await this.userRepository.findByUsername(username);
        if (!user) {
            throw new UserNotFoundException(username);
        }
        return user;
    }

    async create(userData: CreateUserDTO): Promise<User> {
        const existingEmail = await this.userRepository.findByEmail(userData.email);
        if (existingEmail) {
            throw new EmailConflictException(userData.email);
        }
        const existingUsername = await this.userRepository.findByUsername(userData.username);
        if (existingUsername) {
            throw new UsernameConflictException(userData.username);
        }
        return await this.userRepository.create(userData);
    }

    async update(id: string, userData: UpdateUserDTO): Promise<User> {
        const user = await this.userRepository.update(id, userData);
        return user;
    }

    async delete(id: string): Promise<boolean> {
        return await this.userRepository.delete(id);
    }
}
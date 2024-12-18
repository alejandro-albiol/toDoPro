import { IUserService } from "../interfaces/user/IUserService.js";
import { CreateUserDTO, UpdateUserDTO } from "../models/dtos/UserDTO.js";
import { User } from "../models/entities/User.js";
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

    async create(userData: CreateUserDTO): Promise<User> {
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
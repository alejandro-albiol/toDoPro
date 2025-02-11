import { CreateUserDTO } from "../models/dtos/create-user.dto.js";
import { UpdateUserDTO } from "../models/dtos/update-user.dto.js";
import { User } from "../models/entities/user.entity.js";
import { IUserService } from "./i-user.service.js";
import { IUserRepository } from "../repository/i-user.repository.js";
import { UserCreationFailedException } from "../exceptions/user-creation-failed.exception.js";
import { UserNotFoundException } from "../exceptions/user-not-found.exception.js";
import { EmailAlreadyExistsException } from "../exceptions/email-already-exists.exception.js";
import { UsernameAlreadyExistsException } from "../exceptions/username-already-exists.exception.js";
import { InvalidUserDataException } from "../exceptions/invalid-user-data.exception.js";
import { HashService } from "../../shared/services/hash.service.js";
import { UniqueViolationException } from "../../shared/exceptions/database/unique-violation.exception.js";

export class UserService implements IUserService {
    constructor(private userRepository: IUserRepository) {}

    async create(dto: CreateUserDTO): Promise<Partial<User>> {
        try {
            const user: CreateUserDTO = {
                ...dto,
                password: await HashService.hashPassword(dto.password)
            };
            return await this.userRepository.create(user);
        } catch (error) {
            if (error instanceof UniqueViolationException) {
                if (error.message.includes('username')) {
                    throw new UsernameAlreadyExistsException(dto.username);
                }
                if (error.message.includes('email')) {
                    throw new EmailAlreadyExistsException(dto.email);
                }
            }
            throw new UserCreationFailedException('Failed to create user: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
    }

    async findAll(): Promise<User[]> {
        try {
            const users = await this.userRepository.findAll();
            return users.map(({ password, ...user }) => user) as User[];
        } catch (error) {
            throw new InvalidUserDataException('Failed to fetch users: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
    }

    async findById(id: string): Promise<Partial<User> | null> {
        try {
            const user = await this.userRepository.findById(id);
            return user as Partial<User>;
        } catch (error) {
            if (error instanceof UserNotFoundException) {
                return null;
            }
            throw new InvalidUserDataException('Failed to find user: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
    }

    async findByEmail(email: string): Promise<Partial<User> | null> {
        try {
            const user = await this.userRepository.findByEmail(email);
            if (!user) return null;
            return user as Partial<User>;
        } catch (error) {
            throw new InvalidUserDataException('Failed to find user by email: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
    }

    async findByUsername(username: string): Promise<Partial<User> | null> {
        try {
            const user = await this.userRepository.findByUsername(username);
            if (!user) return null;
            return user as Partial<User>;
        } catch (error) {
            throw new InvalidUserDataException('Failed to find user by username: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
    }

    async getPasswordByUsername(username: string): Promise<string | null> {
        try {
            return await this.userRepository.getPasswordByUsername(username);
        } catch (error) {
            throw new InvalidUserDataException('Failed to get user password: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
    }

    async updatePassword(id: string, password: string): Promise<void> {
        try {
            await this.userRepository.findById(id);
            const hashedPassword = await HashService.hashPassword(password);
            await this.userRepository.updatePassword(id, hashedPassword);
        } catch (error) {
            if (error instanceof UserNotFoundException) {
                throw error;
            }
            throw new InvalidUserDataException('Failed to update password: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
    }

    async update(dto: UpdateUserDTO): Promise<Partial<User>> {
        try {
            const user = await this.userRepository.findById(dto.id);
            if (!user) throw new UserNotFoundException('User not found');
            const updatedUser = await this.userRepository.update(dto);
            return updatedUser as Partial<User>;
        } catch (error) {
            if (error instanceof UserNotFoundException) {
                throw error;
            }
            throw new InvalidUserDataException('Failed to update user: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            const user = await this.userRepository.findById(id);
            if (!user) throw new UserNotFoundException('User not found');
            await this.userRepository.delete(id);
            return true;
        } catch (error) {
            if (error instanceof UserNotFoundException) {
                throw error;
            }
            throw new InvalidUserDataException('Failed to delete user: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
    }
}

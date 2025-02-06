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
import { DbErrorCode } from "../../shared/exceptions/enums/db-error-code.enum.js";
import { IGenericDatabaseError } from "../../shared/models/interfaces/base/i-database-error.js";
import { HashService } from "../../shared/services/hash.service.js";

export class UserService implements IUserService {
    constructor(private userRepository: IUserRepository) {}

    private handleDatabaseError(error: IGenericDatabaseError, operation: string): never {
        if (error.code === DbErrorCode.NOT_FOUND) {
            throw new UserNotFoundException(error.metadata?.id || 'unknown');
        }

        if (error.code === DbErrorCode.UNIQUE_VIOLATION) {
            const field = error.metadata?.column;
            const value = error.metadata?.detail?.match(/Key \((.*?)\)=\((.*?)\)/);
            
            if (field === 'email' && value) {
                throw new EmailAlreadyExistsException(value[2]);
            }
            if (field === 'username' && value) {
                throw new UsernameAlreadyExistsException(value[2]);
            }
        }
        
        throw new InvalidUserDataException(`Database error during ${operation}: ${error.message}`);
    }

    private async validateUserExists(id: string): Promise<User> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new UserNotFoundException(id);
        }
        return user;
    }

    async create(dto: CreateUserDTO): Promise<Partial<User>> {
        try {
            const user: CreateUserDTO = {
                ...dto,
                password: await HashService.hashPassword(dto.password)
            };
            
            return await this.userRepository.create(user);
        } catch (error) {
            if (this.isDatabaseError(error)) {
                this.handleDatabaseError(error, 'user creation');
            }

            throw new UserCreationFailedException('Failed to create user: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
    }

    async findAll(): Promise<User[]> {
        try {
            const users = await this.userRepository.findAll();
            return users.map(({ password, ...user }) => user) as User[];
        } catch (error) {
            if (this.isDatabaseError(error)) {
                this.handleDatabaseError(error, 'fetching all users');
            }
            throw new InvalidUserDataException('Failed to fetch users: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
    }

    async findById(id: string): Promise<User | null> {
        try {
            const user = await this.validateUserExists(id);
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword as User;
        } catch (error) {
            if (error instanceof UserNotFoundException) {
                return null;
            }
            if (this.isDatabaseError(error)) {
                this.handleDatabaseError(error, 'finding user by id');
            }
            throw new InvalidUserDataException('Failed to find user: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
    }

    async findByEmail(email: string): Promise<User | null> {
        try {
            const user = await this.userRepository.findByEmail(email);
            if (!user) return null;
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword as User;
        } catch (error) {
            if (this.isDatabaseError(error)) {
                this.handleDatabaseError(error, 'finding user by email');
            }
            throw new InvalidUserDataException('Failed to find user by email: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
    }

    async findByUsername(username: string): Promise<User | null> {
        try {
            const user = await this.userRepository.findByUsername(username);
            if (!user) return null;
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword as User;
        } catch (error) {
            if (this.isDatabaseError(error)) {
                this.handleDatabaseError(error, 'finding user by username');
            }
            throw new InvalidUserDataException('Failed to find user by username: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
    }

    async updatePassword(id: string, password: string): Promise<void> {
        try {
            await this.validateUserExists(id);
            const hashedPassword = await HashService.hashPassword(password);
            await this.userRepository.updatePassword(id, hashedPassword);
        } catch (error) {
            if (this.isDatabaseError(error)) {
                this.handleDatabaseError(error, 'updating password');
            }
            if (error instanceof UserNotFoundException) {
                throw error;
            }
            throw new InvalidUserDataException('Failed to update password: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
    }

    async update(dto: UpdateUserDTO): Promise<UpdateUserDTO> {
        try {
            await this.validateUserExists(dto.id);
            return await this.userRepository.update(dto);
        } catch (error) {
            if (this.isDatabaseError(error)) {
                this.handleDatabaseError(error, 'updating user');
            }
            if (error instanceof UserNotFoundException) {
                throw error;
            }
            throw new InvalidUserDataException('Failed to update user: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            await this.validateUserExists(id);
            return await this.userRepository.delete(id);
        } catch (error) {
            if (this.isDatabaseError(error)) {
                this.handleDatabaseError(error, 'deleting user');
            }
            if (error instanceof UserNotFoundException) {
                throw error;
            }
            throw new InvalidUserDataException('Failed to delete user: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
    }

    private isDatabaseError(error: unknown): error is IGenericDatabaseError {
        return (
            typeof error === 'object' &&
            error !== null &&
            'code' in error &&
            'message' in error
        );
    }
}

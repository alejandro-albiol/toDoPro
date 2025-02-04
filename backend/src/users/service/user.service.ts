import { UpdateUserDTO } from "../models/dtos/update-user.dto.js";
import { User } from "../models/entities/user.entity.js";
import { IUserService } from "./i-user.service.js";
import { IUserRepository } from "../repository/i-user.repository.js";
import { EmailAlreadyExistsException } from "../exceptions/email-already-exists.exception.js";
import { UsernameAlreadyExistsException } from "../exceptions/username-already-exists.exception.js";
import { UserCreationFailedException } from "../exceptions/user-creation-failed.exception.js";
import { DbErrorCode } from "../../shared/models/constants/db-error-code.enum.js";
import { IGenericDatabaseError } from "../../shared/models/interfaces/base/i-database-error.js";

export class UserService implements IUserService {
    constructor(private userRepository: IUserRepository) {}

    async create(user: User): Promise<User> {
        try {
            const existingEmail = await this.userRepository.findByEmail(user.email);
            if (existingEmail) {
                throw new EmailAlreadyExistsException(user.email);

            }

            const existingUsername = await this.userRepository.findByUsername(user.username);
            if (existingUsername) {
                throw new UsernameAlreadyExistsException(user.username);
            }


            return await this.userRepository.create(user);


        } catch (error) {
            if (this.isDatabaseError(error)) {
                switch(error.code) {
                    case DbErrorCode.UNIQUE_VIOLATION:

                        if (error.metadata?.constraint?.includes('email')) {
                            throw new EmailAlreadyExistsException(user.email);
                        }
                        if (error.metadata?.constraint?.includes('username')) {
                            throw new UsernameAlreadyExistsException(user.username);
                        }
                        break;
                    default:
                        throw new UserCreationFailedException('Database error while creating user please try again later');
                }
            }

            if (error instanceof EmailAlreadyExistsException || 
                error instanceof UsernameAlreadyExistsException) {
                throw error;
            }

            throw new UserCreationFailedException('Failed to create user');

        }
    }

    async findAll(): Promise<User[]> {
        return this.userRepository.findAll();
    }

    async findById(id: string): Promise<User> {
        try {
            const user = await this.userRepository.findById(id);
            if (!user) {
                throw new Error('User not found');
            }
            return user;
        } catch (error) {
            throw new Error('Failed to find user by id');
        }
    }


    async findByEmail(email: string): Promise<User> {
        try {

            const user = await this.userRepository.findByEmail(email);
            if (!user) {
                throw new Error('User not found');
            }
            return user;
        } catch (error) {
            throw new Error('Failed to find user by email');
        }
    }

    async updatePassword(id: string, password: string): Promise<void> {
        return this.userRepository.updatePassword(id, password);
    }

    async update(user: UpdateUserDTO): Promise<UpdateUserDTO> {
        return this.userRepository.update(user);
    }

    async delete(id: string): Promise<boolean> {
        return this.userRepository.delete(id);
    } 

    private isDatabaseError(error: any): error is IGenericDatabaseError {
      return 'code' in error && 'message' in error;
  }
}

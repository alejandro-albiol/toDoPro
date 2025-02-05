import { CreateUserDTO } from "../models/dtos/create-user.dto.js";
import { UpdateUserDTO } from "../models/dtos/update-user.dto.js";
import { User } from "../models/entities/user.entity.js";
import { IBaseService } from "../../shared/models/interfaces/base/i-service.js";

/**
 * User service interface that extends the base service interface.
 * Overrides create method to return user without sensitive data.
 */
export interface IUserService extends Omit<IBaseService<User, CreateUserDTO, UpdateUserDTO>, 'create'> {
    /**
     * Creates a new user
     * @param dto The user creation data
     * @returns Created user without sensitive data
     */
    create(dto: CreateUserDTO): Promise<Partial<User>>;

    /**
     * Updates user's password
     * @param id User ID
     * @param password New password
     */
    updatePassword(id: string, password: string): Promise<void>;

    /**
     * Finds a user by their email
     * @param email User's email
     * @returns User if found, null otherwise
     */
    findByEmail(email: string): Promise<User | null>;

    /**
     * Finds a user by their username
     * @param username User's username
     * @returns User if found, null otherwise
     */
    findByUsername(username: string): Promise<User | null>;
}
import { CreateUserDTO } from "../models/dtos/create-user.dto.js";
import { UpdateUserDTO } from "../models/dtos/update-user.dto.js";
import { User } from "../models/entities/user.entity.js";
import { IBaseService } from "../../shared/models/interfaces/base/i-service.js";

/**
 * Service interface for managing user operations.
 * Handles user CRUD operations and authentication-related user data.
 * @interface
 */
export interface IUserService extends Omit<IBaseService<User, CreateUserDTO, UpdateUserDTO>, 'create'> {
    /**
     * Updates a user's password
     * @param {string} id - The user's unique identifier
     * @param {string} password - The new password (will be hashed before storage)
     * @throws {UserNotFoundException} If user is not found
     * @throws {InvalidUserDataException} If password update fails
     */
    updatePassword(id: string, password: string): Promise<void>;

    /**
     * Finds a user by their email address
     * @param {string} email - The email address to search for
     * @returns {Promise<User | null>} The user if found, null otherwise
     * @throws {InvalidUserDataException} If the search operation fails
     */
    findByEmail(email: string): Promise<Partial<User> | null>;

    /**
     * Finds a user by their username
     * @param {string} username - The username to search for
     * @returns {Promise<Partial<User> | null>} The user if found, null otherwise
     * @throws {InvalidUserDataException} If the search operation fails
     */
    findByUsername(username: string): Promise<Partial<User> | null>;

    /**
     * Retrieves a user's hashed password by their username
     * For authentication purposes only
     * @param {string} username - The username to search for
     * @returns {Promise<string | null>} The hashed password if found, null otherwise
     * @throws {InvalidUserDataException} If the operation fails
     * @internal This method should only be used by the authentication service
     */
    getPasswordByUsername(username: string): Promise<string | null>;
}
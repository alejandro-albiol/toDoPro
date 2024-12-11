import pool from '../configuration/configDataBase.js';
import {
  SingleUserResult,
  UserListResult,
  NoDataResult,
} from '../models/responses/ProcessResult.js';
import { User } from '../models/entities/User.js';
import { PasswordServices } from './PasswordServices.js';
import {
  CreateUserDTO,
  UpdateUserDTO,
  ChangePasswordDTO,
  LoginDTO,
} from '../models/dtos/UserDTO';

type UserWithoutPassword = Omit<User, 'password'>;

export class UserService {
  static async createUser(data: CreateUserDTO): Promise<SingleUserResult> {
    try {
      const usernameCheck = await pool.query<Pick<User, 'id'>>(
        'SELECT id FROM users WHERE username = $1',
        [data.username],
      );
      if (usernameCheck.rows.length > 0) {
        return {
          isSuccess: false,
          message: 'Username is already taken',
          data: null,
        };
      }

      const emailCheck = await pool.query<Pick<User, 'id'>>(
        'SELECT id FROM users WHERE email = $1',
        [data.email],
      );
      if (emailCheck.rows.length > 0) {
        return {
          isSuccess: false,
          message: 'Email is already registered',
          data: null,
        };
      }

      const hashedPassword = await PasswordServices.hashPassword(data.password);
      const result = await pool.query<User>(
        `INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email`,
        [data.username, data.email, hashedPassword],
      );

      if (result.rows.length === 0) {
        return {
          isSuccess: false,
          message: 'Failed to create user.',
          data: null,
        };
      }
      return {
        isSuccess: true,
        message: 'User created successfully.',
        data: result.rows[0],
      };
    } catch (error) {
      console.error('Error in createUser:', error);
      return {
        isSuccess: false,
        message: 'Error creating user. Please try again later.',
        data: null,
      };
    }
  }

  static async deleteUser(userId: string): Promise<NoDataResult> {
    try {
      const result = await pool.query(`DELETE FROM users WHERE id = $1`, [
        userId,
      ]);
      return result.rows.length === 0
        ? { isSuccess: false, message: 'Failed to delete user.' }
        : { isSuccess: true, message: `User with ID ${userId} deleted.` };
    } catch (error) {
      return {
        isSuccess: false,
        message: `Error deleting user: ${(error as Error).message}`,
      };
    }
  }

  static async authenticateUser(
    inputUser: LoginDTO,
  ): Promise<SingleUserResult> {
    try {
      const result = await pool.query<User>(
        `SELECT id, username, email, password FROM users WHERE username = $1`,
        [inputUser.username],
      );

      if (result.rows.length === 0) {
        return { isSuccess: false, message: 'User not found.', data: null };
      }

      const user = result.rows[0];
      const isPasswordValid = await PasswordServices.verifyPassword(
        inputUser.password,
        user.password as string,
      );

      if (!isPasswordValid) {
        return { isSuccess: false, message: 'Invalid password', data: null };
      }

      const userWithoutPassword: UserWithoutPassword = {
        id: user.id,
        username: user.username,
        email: user.email,
      };

      return {
        isSuccess: true,
        message: 'Authentication successful',
        data: userWithoutPassword,
      };
    } catch (error) {
      return {
        isSuccess: false,
        message: `Error authenticating user: ${(error as Error).message}`,
        data: null,
      };
    }
  }

  static async getUserById(id: string): Promise<SingleUserResult> {
    try {
      const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [
        id,
      ]);
      return result.rows.length === 0
        ? { isSuccess: false, message: 'User not found', data: null }
        : {
            isSuccess: true,
            message: 'User retrieved successfully.',
            data: result.rows[0] as User,
          };
    } catch (error) {
      return {
        isSuccess: false,
        message: `Error retrieving user by ID: ${(error as Error).message}`,
        data: null,
      };
    }
  }

  static async getAllUsers(): Promise<UserListResult> {
    try {
      const result = await pool.query(`SELECT * FROM users`);
      return result.rows.length === 0
        ? { isSuccess: false, message: 'No users found.', data: null }
        : {
            isSuccess: true,
            message: 'Users retrieved successfully.',
            data: result.rows,
          };
    } catch (error) {
      return {
        isSuccess: false,
        message: `Error retrieving users: ${(error as Error).message}`,
        data: null,
      };
    }
  }

  static async updateUser(userData: UpdateUserDTO): Promise<SingleUserResult> {
    try {
      // Verificar si el username ya existe
      if (userData.username) {
        const usernameCheck = await pool.query(
          'SELECT id FROM users WHERE username = $1 AND id != $2',
          [userData.username, userData.id],
        );

        if (usernameCheck.rows.length > 0) {
          return {
            isSuccess: false,
            message: 'Username is already taken',
            data: null,
          };
        }
      }

      // Verificar si el email ya existe
      if (userData.email) {
        const emailCheck = await pool.query(
          'SELECT id FROM users WHERE email = $1 AND id != $2',
          [userData.email, userData.id],
        );

        if (emailCheck.rows.length > 0) {
          return {
            isSuccess: false,
            message: 'Email is already registered',
            data: null,
          };
        }
      }

      const result = await pool.query(
        `UPDATE users 
         SET username = COALESCE($1, username),
             email = COALESCE($2, email)
         WHERE id = $3 
         RETURNING id, username, email`,
        [userData.username, userData.email, userData.id],
      );

      if (result.rows.length === 0) {
        return {
          isSuccess: false,
          message: 'User not found',
          data: null,
        };
      }

      return {
        isSuccess: true,
        message: 'Profile updated successfully',
        data: result.rows[0] as User,
      };
    } catch (error) {
      console.error('Error in updateUser:', error);
      return {
        isSuccess: false,
        message: 'Error updating profile. Please try again later.',
        data: null,
      };
    }
  }

  static async changePassword(data: ChangePasswordDTO): Promise<NoDataResult> {
    try {
      const userResult = await pool.query<User>(
        `SELECT password FROM users WHERE id = $1`,
        [data.userId],
      );

      if (userResult.rows.length === 0) {
        return { isSuccess: false, message: 'User not found.' };
      }

      const user = userResult.rows[0];
      if (!user.password) {
        return { isSuccess: false, message: 'Invalid user data' };
      }

      const isCurrentPasswordValid = await PasswordServices.verifyPassword(
        data.currentPassword,
        user.password,
      );

      if (!isCurrentPasswordValid) {
        return { isSuccess: false, message: 'Current password is incorrect.' };
      }

      const newHashedPassword = await PasswordServices.hashPassword(
        data.newPassword,
      );

      const updateResult = await pool.query(
        `UPDATE users SET password = $1 WHERE id = $2`,
        [newHashedPassword, data.userId],
      );

      if (updateResult.rowCount === 0) {
        return { isSuccess: false, message: 'Failed to update password.' };
      }

      return { isSuccess: true, message: 'Password updated successfully.' };
    } catch (error) {
      return {
        isSuccess: false,
        message: `Error changing password: ${(error as Error).message}`,
      };
    }
  }
}

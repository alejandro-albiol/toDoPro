import pool from '../configuration/configDataBase.js';
import { ProcessResult } from '../models/ProcessResult.js';
import { User } from '../models/User.js';
import { PasswordServices } from './PasswordServices.js';

export class UserService {
  static async createUser(data: User): Promise<ProcessResult> {
    try {
      const hashedPassword = await PasswordServices.hashPassword(data.password);
      const result = await pool.query(
        `INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *`,
        [data.username, data.email, hashedPassword],
      );

      if (result.rows.length === 0) {
        return { isSuccess: false, message: 'Failed to create user.' };
      } else {
        return { isSuccess: true, message: 'User created successfully.' };
      }
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        error.message.includes('duplicate key value')
      ) {
        return {
          isSuccess: false,
          message: `Error creating user: ${error.message}`,
        };
      }
      return {
        isSuccess: false,
        message: `Error creating user: ${(error as Error).message}`,
      };
    }
  }

  static async deleteUser(userId: string): Promise<ProcessResult> {
    try {
      const result = await pool.query(`DELETE FROM users WHERE id = $1`, [
        userId,
      ]);

      if (result.rows.length === 0) {
        return { isSuccess: false, message: 'Failed to delete user.' };
      } else {
        return { isSuccess: true, message: `User with ID ${userId} deleted.` };
      }
    } catch (error) {
      return {
        isSuccess: false,
        message: `Error deleting user: ${(error as Error).message}`,
      };
    }
  }

  static async authenticateUser(inputUser: User): Promise<ProcessResult> {
    try {
      const result = await pool.query(
        `SELECT id, username, email, password FROM users WHERE username = $1`,
        [inputUser.username],
      );

      if (result.rows.length === 0) {
        return { isSuccess: false, message: 'User not found.' };
      }

      const user = result.rows[0];
      const isPasswordValid = await PasswordServices.verifyPassword(
        inputUser.password,
        user.password,
      );

      if (!isPasswordValid) {
        return { isSuccess: false, message: 'Invalid password' };
      }

      const { password, ...userWithoutPassword } = user;

      return {
        isSuccess: true,
        message: 'Authentication successful',
        data: userWithoutPassword,
      };
    } catch (error) {
      return {
        isSuccess: false,
        message: `Error authenticating user: ${(error as Error).message}`,
      };
    }
  }

  static async getUserId(inputUser: User) {
    try {
      const result = await pool.query(
        `SELECT id FROM users WHERE username = $1`,
        [inputUser.username],
      );

      if (result.rows.length === 0) {
        return { isSuccess: false, message: 'User not found' };
      } else {
        const user = result.rows[0] as User;
        return {
          isSuccess: true,
          message: 'User ID retrieved.',
          result: JSON.stringify(user.id),
        };
      }
    } catch (error) {
      return {
        isSuccess: false,
        message: `Error retrieving user ID: ${(error as Error).message}`,
      };
    }
  }

  static async getUserById(id: string): Promise<ProcessResult> {
    try {
      const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [
        id,
      ]);

      if (result.rows.length === 0) {
        return { isSuccess: false, message: 'User not found' };
      } else {
        return {
          isSuccess: true,
          message: 'User retrieved successfully.',
          data: JSON.stringify(result.rows[0]),
        };
      }
    } catch (error) {
      return {
        isSuccess: false,
        message: `Error retrieving user by ID: ${(error as Error).message}`,
      };
    }
  }

  static async getAllUsers(): Promise<ProcessResult> {
    try {
      const result = await pool.query(`SELECT * FROM users`);

      if (result.rows.length === 0) {
        return { isSuccess: false, message: 'No users found.' };
      } else {
        return {
          isSuccess: true,
          message: 'Users retrieved successfully.',
          data: JSON.stringify(result.rows),
        };
      }
    } catch (error) {
      return {
        isSuccess: false,
        message: `Error retrieving users: ${(error as Error).message}`,
      };
    }
  }

  static async updateUser(data: User): Promise<ProcessResult> {
    try {
      const result = await pool.query(
        `UPDATE users SET username = $1, email = $2 WHERE id = $3 RETURNING *`,
        [data.username, data.email, data.id],
      );

      if (result.rows.length === 0) {
        return { isSuccess: false, message: 'Failed to update user.' };
      } else {
        return { isSuccess: true, message: 'User updated successfully.' };
      }
    } catch (error) {
      return {
        isSuccess: false,
        message: `Error updating user: ${(error as Error).message}`,
      };
    }
  }
}

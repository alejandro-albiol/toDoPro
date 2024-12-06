import pool from '../configuration/configDataBase.js';
import { SingleUserResult, UserListResult, NoDataResult } from '../models/ProcessResult.js';
import { User } from '../models/User.js';
import { PasswordServices } from './PasswordServices.js';

export class UserService {
  static async createUser(data: User): Promise<NoDataResult> {
    try {
      const hashedPassword = await PasswordServices.hashPassword(data.password);
      const result = await pool.query(
        `INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *`,
        [data.username, data.email, hashedPassword],
      );

      if (result.rows.length === 0) {
        return { isSuccess: false, message: 'Failed to create user.' };
      }
      return { isSuccess: true, message: 'User created successfully.' };
    } catch (error) {
      if (error instanceof Error && error.message.includes('duplicate key value')) {
        return { isSuccess: false, message: `Error creating user: ${error.message}` };
      }
      return { isSuccess: false, message: `Error creating user: ${(error as Error).message}` };
    }
  }

  static async deleteUser(userId: string): Promise<NoDataResult> {
    try {
      const result = await pool.query(`DELETE FROM users WHERE id = $1`, [userId]);
      return result.rows.length === 0
        ? { isSuccess: false, message: 'Failed to delete user.' }
        : { isSuccess: true, message: `User with ID ${userId} deleted.` };
    } catch (error) {
      return { isSuccess: false, message: `Error deleting user: ${(error as Error).message}` };
    }
  }

  static async authenticateUser(inputUser: User): Promise<SingleUserResult> {
    try {
      const result = await pool.query(
        `SELECT id, username, email, password FROM users WHERE username = $1`,
        [inputUser.username],
      );

      if (result.rows.length === 0) {
        return { isSuccess: false, message: 'User not found.', data: null };
      }

      const user = result.rows[0];
      const isPasswordValid = await PasswordServices.verifyPassword(
        inputUser.password,
        user.password,
      );

      if (!isPasswordValid) {
        return { isSuccess: false, message: 'Invalid password', data: null };
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
        data: null,
      };
    }
  }

  static async getUserById(id: string): Promise<SingleUserResult> {
    try {
      const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
      return result.rows.length === 0
        ? { isSuccess: false, message: 'User not found', data: null }
        : { isSuccess: true, message: 'User retrieved successfully.', data: result.rows[0] };
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
        : { isSuccess: true, message: 'Users retrieved successfully.', data: result.rows };
    } catch (error) {
      return {
        isSuccess: false,
        message: `Error retrieving users: ${(error as Error).message}`,
        data: null,
      };
    }
  }

  static async updateUser(data: User): Promise<SingleUserResult> {
    try {
      const result = await pool.query(
        `UPDATE users SET username = $1, email = $2 WHERE id = $3 RETURNING *`,
        [data.username, data.email, data.id],
      );
      return result.rows.length === 0
        ? { isSuccess: false, message: 'Failed to update user.', data: null }
        : { isSuccess: true, message: 'User updated successfully.', data: result.rows[0] };
    } catch (error) {
      return {
        isSuccess: false,
        message: `Error updating user: ${(error as Error).message}`,
        data: null,
      };
    }
  }
}

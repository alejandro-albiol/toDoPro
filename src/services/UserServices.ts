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
        [data.username, data.email, hashedPassword]
      );

      if (result.rows.length === 0) {
        return { isSuccess: false, message: 'Failed to create user.' };
      } else {
        return { isSuccess: true, message: 'User created successfully.' };
      }
    } catch (error: any) {
      if (error.code === '23505') {
        return { isSuccess: false, message: `Error creating user: ${error.detail}` };
      }
      return { isSuccess: false, message: `Error creating user: ${error.message}` };
    }
  }

  static async deleteUser(userId: string): Promise<ProcessResult> {
    try {
      const result = await pool.query(
        `DELETE FROM users WHERE id = $1`,
        [userId]
      );

      if (result.rows.length != 0) {
        return { isSuccess: false, message: "Failed to delete user." };
      } else {
        return { isSuccess: true, message: `User with ID ${userId} deleted.` };
      }
    } catch (error) {
      return { isSuccess: false, message: 'Error deleting user.' };
    }
  }

  static async authenticateUser(user:User): Promise<ProcessResult> {
    try {
      const result = await pool.query(
        `SELECT password FROM users WHERE username = $1`,
        [user.username]
      );

      if (result.rows.length === 0) {
        return { isSuccess: false, message: 'User not found.' };
      }

      const isPasswordValid = await PasswordServices.verifyPassword(user.password, result.rows[0].password);

      if (!isPasswordValid) {
        return { isSuccess: false, message: 'Invalid password' };
      }
      return { isSuccess: true, message: 'Authentication successful.' };
    } catch (error) {
      return { isSuccess: false, message: 'Error authenticating user.' };
    }
  }  

  static async getUserId(user:User){
    try {
      const result = await pool.query(
        `SELECT id FROM users WHERE username = $1`,
        [user.username]
      );

      if (result.rows.length === 0) {
        return { isSuccess: false, message: "User not found" };
      } else {
        return { isSuccess: true, message: 'User ID retrieved.', result: result.rows[0].id };
      }
    } catch (error) {
      return { isSuccess: false, message: 'Error retrieving user ID.' };
    }
  }

  static async getUserById(id: string): Promise<ProcessResult> {
    try {
      const result = await pool.query(
        `SELECT * FROM users WHERE id = $1`,
        [id]
      );

      if (result.rows.length === 0) {
        return { isSuccess: false, message: "User not found" };
      } else {
        return { isSuccess: true, message: 'User retrieved successfully.', result: result.rows[0] };
      }
    } catch (error) {
      return { isSuccess: false, message: 'Error retrieving user by ID.' };
    }
  }

  static async getAllUsers(): Promise<ProcessResult> {
    try {
      const result = await pool.query(
        `SELECT * FROM users`
      );

      if (result.rows.length === 0) {
        return { isSuccess: false, message: 'No users found.' };
      } else {
        return { isSuccess: true, message: 'Users retrieved successfully.', result: result.rows };
      }
    } catch (error) {
      return { isSuccess: false, message: 'Error retrieving users.' };
    }
  }

  static async updateUser(data: User): Promise<ProcessResult> {
    try {
      const result = await pool.query(
        `UPDATE users SET username = $1, email = $2 WHERE id = $3 RETURNING *`,
        [data.username, data.email, data.id]
      );

      if (result.rows.length === 0) {
        return { isSuccess: false, message: 'Failed to update user.' };
      } else {
        return { isSuccess: true, message: 'User updated successfully.' };
      }
    } catch (error) {
      return { isSuccess: false, message: 'Error updating user.' };
    }
  }
}
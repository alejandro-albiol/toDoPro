import { IUserRepository } from './i-user.repository.js';
import { User } from '../models/entities/user.entity.js';
import { CreateUserDTO } from '../models/dtos/create-user.dto.js';
import { UpdateUserDTO } from '../models/dtos/update-user.dto.js';
import { DatabaseErrorHandlerService } from '../../shared/database/services/database-error-handler.service.js';
import { IDatabasePool } from '../../shared/models/interfaces/base/i-database-pool.js';
import { UserNotFoundException } from '../exceptions/user-not-found.exception.js';

export class UserRepository implements IUserRepository {

  constructor(private pool: IDatabasePool, private errorHandler: DatabaseErrorHandlerService) {}

  async create(newUser: CreateUserDTO): Promise<User> {
    try {
      const result = await this.pool.query(
        'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
        [newUser.username, newUser.email, newUser.password]
      );
      return result.rows[0];
    } catch (error) {
      this.errorHandler.throwAsException(error);
    }
  }

  async findAll(): Promise<User[]> {
    try {
      const result = await this.pool.query('SELECT * FROM users');
      return result.rows || [];
    } catch (error) {
      this.errorHandler.throwAsException(error);
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      const result = await this.pool.query('SELECT * FROM users WHERE id = $1', [id]);
      return result.rows[0] || null;
    } catch (error) {
      this.errorHandler.throwAsException(error);
    }
  }

  async findByUsername(username: string): Promise<User | null> {
    try {
      const result = await this.pool.query('SELECT * FROM users WHERE username = $1', [username]);
      return result.rows[0] || null;
    } catch (error) {
      this.errorHandler.throwAsException(error);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const result = await this.pool.query('SELECT * FROM users WHERE email = $1', [email]);
      return result.rows[0] || null;
    } catch (error) {
      this.errorHandler.throwAsException(error);
    }
  }

  async update(user: UpdateUserDTO): Promise<UpdateUserDTO> {
    try {
      // Check if the user exists
      const existingUser = await this.findById(user.id);
      if (!existingUser) {
        throw new UserNotFoundException('User not found');
      }

      // Prepare the update query
      const updates: string[] = [];
      const values: (string | number)[] = [];
      let parameterIndex = 1;

      if (user.username !== undefined && user.username !== null) {
        updates.push(`username = $${parameterIndex}`);
        values.push(user.username);
        parameterIndex++;
      }
      if (user.email !== undefined && user.email !== null) {
        updates.push(`email = $${parameterIndex}`);
        values.push(user.email);
        parameterIndex++;
      }

      // Ensure there are fields to update
      if (updates.length === 0) {
        throw new Error('No fields to update');
      }

      values.push(user.id);
      const updateQuery = `UPDATE users SET ${updates.join(', ')} WHERE id = $${parameterIndex} RETURNING id, username, email`;

      // Execute the update query
      const result = await this.pool.query(updateQuery, values);
      if (result.rows.length === 0) {
        throw new Error('Update failed');
      }
      return result.rows[0] as UpdateUserDTO;

    } catch (error) {
      console.error('Error updating user:', error);
      this.errorHandler.throwAsException(error);
    }
  }

  async updatePassword(userId: string, newHashedPassword: string): Promise<void> {
    try {
      await this.pool.query('UPDATE users SET password = $1 WHERE id = $2', [newHashedPassword, userId]);
    } catch (error) {
      this.errorHandler.throwAsException(error);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.pool.query('DELETE FROM users WHERE id = $1', [id]);

      if (result.rowCount === 0) {
        return false;
      }


      return true;
    } catch (error) {
      this.errorHandler.throwAsException(error);
    }
  }
}

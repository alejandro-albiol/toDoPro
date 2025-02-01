import { IUserRepository } from './i-user.repository.js';
import { User } from '../models/entities/user.entity.js';
import { pool } from '../../config/database.config.js';
import { CreateUserDTO } from '../models/dtos/create-user.dto.js';
import { UpdateUserDTO } from '../models/dtos/update-user.dto.js';
import { UpdatedUserDTO } from '../models/dtos/updated-user.dto.js';
import { DataBaseException } from '../../shared/models/exceptions/database.exception.js';
import { DataBaseErrorCode } from '../../shared/models/exceptions/enums/data-base-error-code.enum.js';
import { IDatabaseError } from '../../shared/models/interfaces/i-database-error.js';
import { IDatabasePool } from '../../shared/interfaces/database-pool.interface.js';

export class UserRepository implements IUserRepository {

  constructor(private pool: IDatabasePool) {}

  private handleDatabaseError(error: any): never {
    const dbError = error as IDatabaseError;
    const metadata: any = {};
    
    if (dbError.constraint) metadata.constraint = dbError.constraint;
    if (dbError.detail) metadata.detail = dbError.detail;

    switch(dbError.code) {
        case DataBaseErrorCode.UNIQUE_VIOLATION:
            throw new DataBaseException(
                'Duplicate entry',
                DataBaseErrorCode.UNIQUE_VIOLATION,
                metadata
            );
        
        case DataBaseErrorCode.NOT_NULL_VIOLATION:
            throw new DataBaseException(
                'Not null violation',
                DataBaseErrorCode.NOT_NULL_VIOLATION,
                metadata
            );

        case DataBaseErrorCode.FOREIGN_KEY_VIOLATION:
            throw new DataBaseException(
                'Foreign key violation',
                DataBaseErrorCode.FOREIGN_KEY_VIOLATION,
                metadata
            );

        case DataBaseErrorCode.INVALID_INPUT:
            throw new DataBaseException(
                'Invalid input',
                DataBaseErrorCode.INVALID_INPUT,
                metadata
            );

        case DataBaseErrorCode.NOT_FOUND:
            throw new DataBaseException(
                'Resource not found',
                DataBaseErrorCode.NOT_FOUND,
                metadata
            );

        default:
            throw new DataBaseException(
                'Unknown database error',
                DataBaseErrorCode.UNKNOWN_ERROR,
                metadata
            );
    }
  }

  async create(newUser: CreateUserDTO): Promise<User> {
    try {
      const result = await this.pool.query(
        'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
        [newUser.username, newUser.email, newUser.password]
      );
      return result.rows[0];
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  async findAll(): Promise<User[]> {
    try {
      const result = await this.pool.query('SELECT * FROM users');
      return result.rows || [];
    } catch (error) {
      const dbError = error as IDatabaseError;
      if (dbError.code === DataBaseErrorCode.NOT_FOUND) {
        throw new DataBaseException(
          'No users found',
          DataBaseErrorCode.NOT_FOUND,
          {
            constraint: dbError.constraint,
            detail: dbError.detail
          }
        );
      }

      throw new DataBaseException('Unknown database error', DataBaseErrorCode.UNKNOWN_ERROR);
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      const result = await this.pool.query('SELECT * FROM users WHERE id = $1', [id]);
      return result.rows[0] || null;
    } catch (error) {
      throw this.handleDatabaseError(error);
    }
  }

  async findByUsername(username: string): Promise<User | null> {
    try {
      const result = await this.pool.query(
        'SELECT * FROM users WHERE username = $1',
        [username],
      );
      if (result.rows.length === 0) {
        return null;
      }
      return result.rows[0];
    } catch (error) {
      const dbError = error as IDatabaseError;

      if (dbError.code === DataBaseErrorCode.NOT_FOUND) {
        throw new DataBaseException(
          'User not found',
          DataBaseErrorCode.NOT_FOUND
        );
      }

      if (dbError.code === DataBaseErrorCode.UNDEFINED_COLUMN) {
        throw new DataBaseException(
          'Invalid column reference',
          DataBaseErrorCode.UNDEFINED_COLUMN,
          {
            constraint: dbError.constraint,
            detail: dbError.detail
          }
        );
      }

      throw new DataBaseException(
        'Error finding user',
        DataBaseErrorCode.UNKNOWN_ERROR,
        {
          constraint: dbError.constraint,
          detail: dbError.detail
        }
      );
    }
  }


  async findByEmail(email: string): Promise<User | null> {
    try {
      const result = await this.pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );

      if (result.rows.length === 0) {
        return null;
      }
    
      return result.rows[0];
    } catch (error) {
      const dbError = error as IDatabaseError;
      
      if (dbError.code === DataBaseErrorCode.NOT_FOUND) {
        throw new DataBaseException(
          'User not found',
          DataBaseErrorCode.NOT_FOUND,
          {
            constraint: dbError.constraint,
            detail: dbError.detail
          }
        );
      }


      if (dbError.code === DataBaseErrorCode.UNDEFINED_COLUMN) {
        throw new DataBaseException(
          'Invalid column reference',
          DataBaseErrorCode.UNDEFINED_COLUMN,
          {
            constraint: dbError.constraint,
            detail: dbError.detail
          }
        );
      }

      throw new DataBaseException(
        'Error finding user',
        DataBaseErrorCode.UNKNOWN_ERROR,
        {
          constraint: dbError.constraint,
          detail: dbError.detail
        }
      );
    }
  }

  async update(user: UpdateUserDTO): Promise<User> {
    try {
        const checkUser = await this.pool.query(
            'SELECT id FROM users WHERE id = $1',
            [user.id]
        );

        if (checkUser.rowCount === 0) {
            throw new DataBaseException(
                'User not found',
                DataBaseErrorCode.NOT_FOUND,
                { detail: `User with id ${user.id} not found` }
            );
        }

        const updates: string[] = [];
        const values: any[] = [];
        let parameterIndex = 1;

        if (user.username !== undefined) {
            updates.push(`username = $${parameterIndex}`);
            values.push(user.username);
            parameterIndex++;
        }
        if (user.email !== undefined) {
            updates.push(`email = $${parameterIndex}`);
            values.push(user.email);
            parameterIndex++;
        }

        values.push(user.id);
        const updateQuery = `
            UPDATE users 
            SET ${updates.join(', ')} 
            WHERE id = $${parameterIndex} 
            RETURNING *
        `;

        const result = await this.pool.query(updateQuery, values);
        return result.rows[0];
    } catch (error) {
        if (error instanceof DataBaseException) {
            throw error;
        }
        throw this.handleDatabaseError(error);
    }
  }

  async updatePassword(userId: string, newHashedPassword: string): Promise<void> {
    try {
      await this.pool.query('UPDATE users SET password = $1 WHERE id = $2', [newHashedPassword, userId]);
    } catch (error) {
      const dbError = error as IDatabaseError;
      if (dbError.code === DataBaseErrorCode.NOT_FOUND) {
        throw new DataBaseException(
          'User not found',
          DataBaseErrorCode.NOT_FOUND,
          {
            constraint: 'user_id',
            detail: 'User not found'
          }
        );
      }
      throw new DataBaseException('Unknown database error', DataBaseErrorCode.UNKNOWN_ERROR);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
        const result = await this.pool.query(
            'DELETE FROM users WHERE id = $1',
            [id]
        );
        
        if (result.rowCount === 0) {
            throw new DataBaseException(
                'User not found',
                DataBaseErrorCode.NOT_FOUND,
                { detail: `User with id ${id} not found` }
            );
        }
        
        return true;
    } catch (error) {
        if (error instanceof DataBaseException) {
            throw error;
        }
        throw this.handleDatabaseError(error);
    }
  }
}

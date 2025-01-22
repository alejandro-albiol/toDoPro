import { IUserRepository } from './IUserRepository.js';
import { User } from '../models/entities/User.js';
import { pool } from '../../config/configDataBase.js';
import { CreateUserDTO } from '../models/dtos/CreateUserDTO.js';
import { UpdateUserDTO } from '../models/dtos/UpdateUserDTO.js';
import { UpdatedUserDTO } from '../models/dtos/UpdatedUserDTO.js';
import { DataBaseException } from '../../shared/exceptions/DataBaseException.js';
import { DataBaseErrorCode } from '../../shared/exceptions/enums/DataBaseErrorCode.enum.js';
import { IDatabaseError } from '../../shared/interfaces/IDataBaseError.js';

export class UserRepository implements IUserRepository {

  async create(newUser: CreateUserDTO): Promise<User> {
    try {
      const result = await pool.query(
        'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
        [newUser.username, newUser.email, newUser.password],
      );
      return result.rows[0];
    } catch (error) {
      const dbError = error as IDatabaseError;

      if (dbError.code === DataBaseErrorCode.INVALID_INPUT) {
        throw new DataBaseException(
          dbError.message || 'Invalid input syntax',
          DataBaseErrorCode.INVALID_INPUT,
          {
            constraint: dbError.constraint,
            detail: dbError.detail
          }
        );
      }

      if (dbError.code === DataBaseErrorCode.UNIQUE_VIOLATION) {
        throw new DataBaseException(
          dbError.message || 'Unique constraint violation',
          DataBaseErrorCode.UNIQUE_VIOLATION,
          {
            constraint: dbError.constraint,
            detail: dbError.detail
          }
        );
      }
      
      if (dbError.code === DataBaseErrorCode.NOT_NULL_VIOLATION) {
        throw new DataBaseException(
          'Not null constraint violation',
          DataBaseErrorCode.NOT_NULL_VIOLATION,
          {
            constraint: dbError.constraint,
            detail: dbError.detail
          }
        );
      }
      
      throw new DataBaseException(
        'Unknown database error',
        DataBaseErrorCode.UNKNOWN_ERROR,
        {
          constraint: dbError.constraint,
          detail: dbError.detail
        }
      );
    }
  }

  async findAll(): Promise<User[]> {
    try {
      const result = await pool.query('SELECT * FROM users');
      return result.rows || [];
    } catch (error) {
      throw new DataBaseException('Unknown database error', DataBaseErrorCode.UNKNOWN_ERROR);
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
      return result.rows[0] || null;
    } catch (error) {
      const dbError = error as IDatabaseError;
      if (dbError.code === DataBaseErrorCode.NOT_FOUND) {
        throw new DataBaseException(
          'User not found',
          DataBaseErrorCode.NOT_FOUND
        );
      }
      throw new DataBaseException('Error finding user', DataBaseErrorCode.UNKNOWN_ERROR);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const result = await pool.query(
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

  async findByUsername(username: string): Promise<User | null> {
    try {
      const result = await pool.query(
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

  async update(updatedUser: UpdateUserDTO): Promise<UpdatedUserDTO> {
    try {

      const existingUser = await this.findById(updatedUser.id);
      if (!existingUser) {
        throw new DataBaseException(
          'User not found',
          DataBaseErrorCode.NOT_FOUND,
          {
            constraint: 'user_id',
            detail: 'User not found'
          }
        );
      }

      const setClause: string[] = [];
      const values: any[] = [];
      let paramCount = 1;

      if (updatedUser.username) {
        setClause.push(`username = $${paramCount}`);
        values.push(updatedUser.username);
        paramCount++;
      }
      if (updatedUser.email) {
        setClause.push(`email = $${paramCount}`);
        values.push(updatedUser.email);
        paramCount++;
      }

      const USER_ID_INDEX = paramCount;
      values.push(updatedUser.id);

      const query = `
        UPDATE users 
        SET ${setClause.join(', ')} 
        WHERE id = $${USER_ID_INDEX} 
        RETURNING *
      `;

      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      const dbError = error as IDatabaseError;
      
      if (dbError.code === DataBaseErrorCode.UNIQUE_VIOLATION) {
        throw new DataBaseException(
          'Unique constraint violation',
          DataBaseErrorCode.UNIQUE_VIOLATION,
          {
            constraint: dbError.constraint,
            detail: dbError.detail
          }
        );
      }

      if (dbError.code === DataBaseErrorCode.NOT_NULL_VIOLATION) {
        throw new DataBaseException(
          'Not null constraint violation',
          DataBaseErrorCode.NOT_NULL_VIOLATION,
          {
            constraint: dbError.constraint,
            detail: dbError.detail
          }
        );
      }

      throw new DataBaseException(
        'Unknown database error',
        DataBaseErrorCode.UNKNOWN_ERROR,
        {
          constraint: dbError.constraint,
          detail: dbError.detail
        }
      );
    }
  }

  async updatePassword(userId: string, newHashedPassword: string): Promise<void> {
    try {
      await pool.query('UPDATE users SET password = $1 WHERE id = $2', [newHashedPassword, userId]);
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

  async delete(id: string): Promise<void> {
    try {
      await pool.query(
        'DELETE FROM users WHERE id = $1',
        [id],
      );
    } catch (error) {
      const dbError = error as IDatabaseError;
      
      if (dbError.code === DataBaseErrorCode.FOREIGN_KEY_VIOLATION) {
        throw new DataBaseException(
          'Cannot delete due to existing references',
          DataBaseErrorCode.FOREIGN_KEY_VIOLATION,
          {
            constraint: dbError.constraint,
            detail: dbError.detail
          }
        );
      }

      if (dbError.code === DataBaseErrorCode.NOT_FOUND) {
        throw new DataBaseException(
          'User not found',
          DataBaseErrorCode.NOT_FOUND
        );
      }

      throw new DataBaseException(
        'Unknown database error',
        DataBaseErrorCode.UNKNOWN_ERROR,
        {
          constraint: dbError.constraint,
          detail: dbError.detail
        }
      );
    }
  }
}

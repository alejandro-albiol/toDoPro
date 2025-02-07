import { UpdateUserDTO } from "../models/dtos/update-user.dto.js";
import { User, UserWithoutPassword } from "../models/entities/user.entity.js";
import { IUserRepository } from "./i-user.repository.js";
import { HashService } from "../../shared/services/hash.service.js";
import { IDatabasePool } from "../../shared/models/interfaces/base/i-database-pool.js";
import { DatabaseError } from "pg";
import { DbErrorCode } from "../../shared/models/constants/db-error-code.enum.js";
import { IGenericDatabaseError } from "../../shared/models/interfaces/base/i-database-error.js";

export class UserRepository implements IUserRepository {
  constructor(private pool: IDatabasePool) {}

  async create(user: User): Promise<Partial<User>> {
    const query = `
      INSERT INTO users (username, email, password)
      VALUES ($1, $2, $3)
      RETURNING id, username, email;
    `;

    try {
      const result = await this.pool.query(query, [user.username, user.email, user.password]);
      
      return {
        ...result.rows[0]
      } as Partial<User>;
      
    } catch (error) {
      if (error instanceof DatabaseError) {
        const errorCode = error.code;
        
        throw {
          code: errorCode,
          message: error.message,
          metadata: {
            detail: error.detail,
            constraint: error.constraint,
            table: error.table,
            column: error.column
          }
        } as IGenericDatabaseError;
      }
      
      if (typeof error === 'object' && error !== null && 'code' in error) {
        throw {
          code: (error as any).code,
          message: error instanceof Error ? error.message : 'Unknown error'
        } as IGenericDatabaseError;
      }
      
      throw {
        code: DbErrorCode.UNKNOWN_ERROR,
        message: 'An unexpected error occurred while creating user',
        metadata: { detail: error instanceof Error ? error.message : 'Unknown error' }
      } as IGenericDatabaseError;
    }
  }

  async findAll(): Promise<User[]> {
    const query = `
      SELECT id, username, email
      FROM users
    `;

    try {
      const result = await this.pool.query(query);
      return result.rows;
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw {
          code: error.code as DbErrorCode,
          message: error.message,
          metadata: { 
            detail: error.detail,
            constraint: error.constraint,
            table: error.table,
            column: error.column
          }
        } as IGenericDatabaseError;
      }
      
      throw {
        code: DbErrorCode.UNKNOWN_ERROR,
        message: 'An unexpected error occurred while finding all users',
        metadata: { detail: error instanceof Error ? error.message : 'Unknown error' }
      } as IGenericDatabaseError;
    }
  }

  async findById(id: string): Promise<User | null> {
    const query = `
      SELECT id, username, email
      FROM users
      WHERE id = $1
    `;

    try {
      const result = await this.pool.query(query, [id]);
      if (result.rows.length > 0) {
        const user = result.rows[0];
        return user as User;
      }
      return null;
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw {
          code: error.code as DbErrorCode,
          message: error.message,
          metadata: { 
            detail: error.detail,
            constraint: error.constraint,
            table: error.table,
            column: error.column
          }
        } as IGenericDatabaseError;
      }
      
      throw {
        code: DbErrorCode.UNKNOWN_ERROR,
        message: 'An unexpected error occurred while finding user by id',
        metadata: { detail: error instanceof Error ? error.message : 'Unknown error' }
      } as IGenericDatabaseError;
    }
  }

  async findByUsername(username: string): Promise<User | null> {
    const query = `
      SELECT id, username, email
      FROM users
      WHERE username = $1
    `;

    try {
      const result = await this.pool.query(query, [username]);
      if (result.rows.length > 0) {
        const user = result.rows[0];
        return user as User;
      }
      return null;
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw {
          code: error.code as DbErrorCode,
          message: error.message,
          metadata: { 
            detail: error.detail,
            constraint: error.constraint,
            table: error.table,
            column: error.column
          }
        } as IGenericDatabaseError;
      }
      
      throw {
        code: DbErrorCode.UNKNOWN_ERROR,
        message: 'An unexpected error occurred while finding user by username',
        metadata: { detail: error instanceof Error ? error.message : 'Unknown error' }
      } as IGenericDatabaseError;
    }
  }

  async getPasswordByUsername(username: string): Promise<string | null> {
    const query = `
      SELECT password
      FROM users
      WHERE username = $1
    `;

    try {
      const result = await this.pool.query(query, [username]);
      if (result.rows.length > 0) {
        return result.rows[0].password;
      }
      return null;
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw {
          code: error.code as DbErrorCode,
          message: error.message,
          metadata: { 
            detail: error.detail,
            constraint: error.constraint,
            table: error.table,
            column: error.column
          }
        } as IGenericDatabaseError;
      }
      
      throw {
        code: DbErrorCode.UNKNOWN_ERROR,
        message: 'An unexpected error occurred while getting user password',
        metadata: { detail: error instanceof Error ? error.message : 'Unknown error' }
      } as IGenericDatabaseError;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    const query = `
      SELECT id, username, email
      FROM users
      WHERE email = $1
    `;

    try {
      const result = await this.pool.query(query, [email]);
      if (result.rows.length > 0) {
        const user = result.rows[0];
        return user as User;
      }
      return null;
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw {
          code: error.code as DbErrorCode,
          message: error.message,
          metadata: { 
            detail: error.detail,
            constraint: error.constraint,
            table: error.table,
            column: error.column
          }
        } as IGenericDatabaseError;
      }
      
      throw {
        code: DbErrorCode.UNKNOWN_ERROR,
        message: 'An unexpected error occurred while finding user by email',
        metadata: { detail: error instanceof Error ? error.message : 'Unknown error' }
      } as IGenericDatabaseError;
    }
  }

  async updatePassword(id: string, password: string): Promise<void> {
    const query = `
      UPDATE users
      SET password = $2
      WHERE id = $1
    `;

    try {
      const result = await this.pool.query(query, [id, password]);
      
      if (result.rowCount === 0) {
        throw {
          code: DbErrorCode.NOT_FOUND,
          message: 'User not found',
          metadata: { detail: `User with id ${id} does not exist` }
        } as IGenericDatabaseError;
      }
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw {
          code: error.code as DbErrorCode,
          message: error.message,
          metadata: { 
            detail: error.detail,
            constraint: error.constraint,
            table: error.table,
            column: error.column
          }
        } as IGenericDatabaseError;
      }
      
      if ((error as IGenericDatabaseError).code) {
        throw error;
      }

      throw {
        code: DbErrorCode.UNKNOWN_ERROR,
        message: 'An unexpected error occurred while updating user password',
        metadata: { detail: error instanceof Error ? error.message : 'Unknown error' }
      } as IGenericDatabaseError;
    }
  }

  async update(user: UpdateUserDTO): Promise<UpdateUserDTO> {
    const query = `
      UPDATE users
      SET username = $2, email = $3
      WHERE id = $1
      RETURNING id, username, email
    `;

    try {
      const result = await this.pool.query(query, [user.id, user.username, user.email]);
      
      if (result.rows.length === 0) {
        throw {
          code: DbErrorCode.NOT_FOUND,
          message: 'User not found',
          metadata: { detail: `User with id ${user.id} does not exist` }
        } as IGenericDatabaseError;
      }

      return result.rows[0] as UpdateUserDTO;
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw {
          code: error.code as DbErrorCode,
          message: error.message,
          metadata: { 
            detail: error.detail,
            constraint: error.constraint,
            table: error.table,
            column: error.column
          }
        } as IGenericDatabaseError;
      }
      
      if ((error as IGenericDatabaseError).code) {
        throw error;
      }

      throw {
        code: DbErrorCode.UNKNOWN_ERROR,
        message: 'An unexpected error occurred while updating user',
        metadata: { detail: error instanceof Error ? error.message : 'Unknown error' }
      } as IGenericDatabaseError;
    }
  }

  async delete(id: string): Promise<boolean> {
    const query = `
      DELETE FROM users
      WHERE id = $1
    `;

    try {
      const result = await this.pool.query(query, [id]);
      return result.rowCount > 0;
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw {
          code: error.code as DbErrorCode,
          message: error.message,
          metadata: { 
            detail: error.detail,
            constraint: error.constraint,
            table: error.table,
            column: error.column
          }
        } as IGenericDatabaseError;
      }
      
      throw {
        code: DbErrorCode.UNKNOWN_ERROR,
        message: 'An unexpected error occurred while deleting user',
        metadata: { detail: error instanceof Error ? error.message : 'Unknown error' }
      } as IGenericDatabaseError;
    }
  }
}

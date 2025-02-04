import { UpdateUserDTO } from "../models/dtos/update-user.dto.js";
import { User } from "../models/entities/user.entity.js";
import { IUserRepository } from "./i-user.repository.js";
import { HashService } from "../../shared/services/hash.service.js";
import { IDatabasePool } from "../../shared/models/interfaces/base/i-database-pool.js";
import { DatabaseError } from "pg";
import { DbErrorCode } from "../../shared/models/constants/db-error-code.enum.js";
import { IGenericDatabaseError } from "../../shared/models/interfaces/base/i-database-error.js";

export class UserRepository implements IUserRepository {
  constructor(private pool: IDatabasePool) {}

  async create(user: User): Promise<User> {
    const query = `
      INSERT INTO users (username, email, password)
      VALUES ($1, $2, $3)
      RETURNING id, username, email;
    `;

    try {
      const hashedPassword = await HashService.hashPassword(user.password);
      const result = await this.pool.query(query, [user.username, user.email, hashedPassword]);
      
      return {
        ...result.rows[0],
        password: undefined
      } as User;

    } catch (error) {
      if (error instanceof DatabaseError) {
        const dbError: IGenericDatabaseError = {
          code: error.code as DbErrorCode,
          message: error.message,
          metadata: {
            detail: 'detail' in error ? error.detail : undefined,
            constraint: 'constraint' in error ? error.constraint : undefined,
            table: 'table' in error ? error.table : undefined,
            column: 'column' in error ? error.column : undefined
          }
        };

        throw dbError;
      }
      
      throw {
        code: DbErrorCode.UNKNOWN_ERROR,
        message: 'An unexpected error occurred while creating user',
        metadata: {
          detail: error instanceof Error ? error.message : 'Unknown error'
        }
      } as IGenericDatabaseError;
    }
  }

  async findAll(): Promise<User[]> {
    throw new Error('Method not implemented.');
  }

  async findById(id: string): Promise<User> {
    throw new Error('Method not implemented.');
  }

  async findByUsername(username: string): Promise<User> {
    throw new Error('Method not implemented.');
  }

  async findByEmail(email: string): Promise<User> {
    throw new Error('Method not implemented.');
  }

  async updatePassword(id: string, password: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async update(user: UpdateUserDTO): Promise<UpdateUserDTO> {
    throw new Error('Method not implemented.');
  }

  async delete(id: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}

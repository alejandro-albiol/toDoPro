import { UpdateUserDTO } from "../models/dtos/update-user.dto.js";
import { User } from "../models/entities/user.entity.js";
import { IUserRepository } from "./i-user.repository.js";
import { IDatabasePool } from "../../shared/models/interfaces/base/i-database-pool.js";
import { DatabaseError } from "pg-protocol";
import { CreateUserDTO } from "../models/dtos/create-user.dto.js";
import { UniqueViolationException } from "../../shared/exceptions/database/unique-violation.exception.js";
import { NotFoundException } from "../../shared/exceptions/database/not-found.exception.js";
import { ForeignKeyViolationException } from "../../shared/exceptions/database/foreign-key-violation.exception.js";
import { NotNullViolationException } from "../../shared/exceptions/database/not-null-violation.exception.js";
import { InvalidInputException } from "../../shared/exceptions/database/invalid-input.exception.js";
import { UndefinedColumnException } from "../../shared/exceptions/database/undefined-column.exception.js";
import { ConnectionErrorException } from "../../shared/exceptions/database/connection-error.exception.js";
import { DbErrorCode } from "../../shared/exceptions/database/enum/db-error-code.enum.js";
import { UnknownErrorException } from "../../shared/exceptions/database/unknown-error.exception.js";

export class UserRepository implements IUserRepository {
  constructor(private pool: IDatabasePool) {}

  private handleDatabaseError(error: DatabaseError, context?: { username?: string; email?: string }) {
    switch (error.code) {
      case DbErrorCode.UNIQUE_VIOLATION:
        if (context) {
          if (error.detail?.includes("Key (username)")) {
            throw new UniqueViolationException(`username ${context.username} already exists`);
          }
          if (error.detail?.includes("Key (email)")) {
            throw new UniqueViolationException(`email ${context.email} already exists`);
          }
        }
        throw new UniqueViolationException(`Unique constraint violation: ${error.detail}`);
      case DbErrorCode.FOREIGN_KEY_VIOLATION:
        throw new ForeignKeyViolationException(`Foreign key violation: ${error.detail}`);
      case DbErrorCode.NOT_NULL_VIOLATION:
        throw new NotNullViolationException(`Not null violation: ${error.detail}`);
      case DbErrorCode.INVALID_INPUT:
        throw new InvalidInputException(`Invalid input: ${error.detail}`);
      case DbErrorCode.UNDEFINED_COLUMN:
        throw new UndefinedColumnException(`Undefined column: ${error.detail}`);
      case DbErrorCode.CONNECTION_ERROR:
        throw new ConnectionErrorException(`Connection error: ${error.detail}`);
      default:
        throw new UnknownErrorException(`Database error: ${error.message}`);
    }
  }

  private handleQueryError(error: unknown, context?: { username?: string; email?: string }) {
    if (error instanceof DatabaseError) {
      this.handleDatabaseError(error, context);
    }
    throw error;
  }

  async create(user: CreateUserDTO): Promise<Partial<User>> {
    const query = `
      INSERT INTO users (username, email, password)
      VALUES ($1, $2, $3)
      RETURNING id, username, email;
    `;

    try {
      const result = await this.pool.query(query, [user.username, user.email, user.password]);
      return result.rows[0] as Partial<User>;
    } catch (error) {
      throw this.handleQueryError(error, { username: user.username ?? undefined, email: user.email ?? undefined });
    }
  }

  async findAll(): Promise<User[]> {
    const query = `SELECT id, username, email FROM users`;

    try {
      const result = await this.pool.query(query);
      return result.rows as User[];
    } catch (error) {
      this.handleQueryError(error);
      throw error;
    }
  }

  async findById(id: string): Promise<Partial<User> | null> {
    const query = `SELECT id, username, email FROM users WHERE id = $1`;

    try {
      const result = await this.pool.query(query, [id]);
      return result.rows[0] as Partial<User> || null;
    } catch (error) {
      this.handleQueryError(error);
      throw error;
    }
  }

  async findByUsername(username: string): Promise<Partial<User> | null> {
    const query = `SELECT id, username, email FROM users WHERE username = $1`;

    try {
      const result = await this.pool.query(query, [username]);
      return result.rows[0] as Partial<User> || null;
    } catch (error) {
      this.handleQueryError(error);
      throw error;
    }
  }

  async getPasswordByUsername(username: string): Promise<string | null> {
    const query = `SELECT password FROM users WHERE username = $1`;

    try {
      const result = await this.pool.query(query, [username]);
      return result.rows[0]?.password || null;
    } catch (error) {
      this.handleQueryError(error);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<Partial<User> | null> {
    const query = `SELECT id, username, email FROM users WHERE email = $1`;

    try {
      const result = await this.pool.query(query, [email]);
      return result.rows[0] as Partial<User> || null;
    } catch (error) {
      this.handleQueryError(error);
      throw error;
    }
  }

  async updatePassword(id: string, password: string): Promise<void> {
    const query = `UPDATE users SET password = $2 WHERE id = $1`;

    try {
      const result = await this.pool.query(query, [id, password]);
      if (result.rowCount === 0) {
        throw new NotFoundException(`User not found with id: ${id}`);
      }
    } catch (error) {
      this.handleQueryError(error);
      throw error;
    }
  }

  async update(user: UpdateUserDTO): Promise<Partial<User>> {
    const query = `
      UPDATE users
      SET username = $2, email = $3
      WHERE id = $1
      RETURNING id, username, email
    `;

    try {
      const result = await this.pool.query(query, [user.id, user.username, user.email]);
      if (result.rows.length === 0) {
        throw new NotFoundException(`User not found with id: ${user.id}`);
      }
      return result.rows[0] as Partial<User>;
    } catch (error) {
      this.handleQueryError(error, { username: user.username ?? undefined, email: user.email ?? undefined });
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    const query = `DELETE FROM users WHERE id = $1`;

    try {
      const result = await this.pool.query(query, [id]);
      if (result.rowCount === 0) {
        throw new NotFoundException(`User not found with id: ${id}`);
      }
    } catch (error) {
      this.handleQueryError(error);
      throw error;
    }
  }
}
import { DatabaseError } from "pg-protocol";
import { IDatabasePool } from "../../shared/models/interfaces/base/i-database-pool.js";
import { CreateTaskDTO } from "../models/dtos/create-task.dto.js";
import { UpdateTaskDTO } from "../models/dtos/update-task.dto.js";
import { Task } from "../models/entities/task.entity.js";
import { ITaskRepository } from "./i-task.repository.js";
import { ConnectionErrorException } from "../../shared/exceptions/database/connection-error.exception.js";
import { DbErrorCode } from "../../shared/exceptions/database/enum/db-error-code.enum.js";
import { ForeignKeyViolationException } from "../../shared/exceptions/database/foreign-key-violation.exception.js";
import { InvalidInputException } from "../../shared/exceptions/database/invalid-input.exception.js";
import { NotNullViolationException } from "../../shared/exceptions/database/not-null-violation.exception.js";
import { UndefinedColumnException } from "../../shared/exceptions/database/undefined-column.exception.js";
import { UnknownErrorException } from "../../shared/exceptions/database/unknown-error.exception.js";
import { NotFoundException } from "../../shared/exceptions/database/not-found.exception.js";

export class TaskRepository implements ITaskRepository {
  constructor(private pool: IDatabasePool) {}

  private handleDatabaseError(error: DatabaseError) {
    switch (error.code) {
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

  private handleQueryError(error: unknown) {
    if (error instanceof DatabaseError) {
      this.handleDatabaseError(error);
    }
    throw error;
  }

  async create(task: CreateTaskDTO): Promise<Partial<Task>> {
    const query = `
      INSERT INTO tasks (title, description, user_id)
      VALUES ($1, $2, $3)
      RETURNING id, title, description, completed, user_id;
    `;

    try {
      const result = await this.pool.query(query, [task.title, task.description, task.user_id]);
      return result.rows[0] as Partial<Task>;
    } catch (error) {
      this.handleQueryError(error);
      throw error;
    }
  }

  async findAll(): Promise<Task[]> {
    const query = `SELECT * FROM tasks`;

    try {
      const result = await this.pool.query(query);
      return result.rows as Task[];
    } catch (error) {
      this.handleQueryError(error);
      throw error;
    }
  }

  async findAllByUserId(userId: string): Promise<Task[] | null> {
    const query = `SELECT * FROM tasks WHERE user_id = $1`;

    try {
      const result = await this.pool.query(query, [userId]);
      return result.rows.length ? result.rows as Task[] : null;
    } catch (error) {
      this.handleQueryError(error);
      throw error;
    }
  }

  async findAllCompletedByUserId(userId: string): Promise<Task[]> {
    const query = `SELECT * FROM tasks WHERE user_id = $1 AND completed = true`;

    try {
      const result = await this.pool.query(query, [userId]);
      return result.rows as Task[];
    } catch (error) {
      this.handleQueryError(error);
      throw error;
    }
  }

  async findById(id: string): Promise<Task | null> {
    const query = `SELECT * FROM tasks WHERE id = $1`;

    try {
      const result = await this.pool.query(query, [id]);
      return result.rows[0] as Task || null;
    } catch (error) {
      this.handleQueryError(error);
      throw error;
    }
  }

  async update(updatedTask: UpdateTaskDTO): Promise<Task> {
    const setClause: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (updatedTask.title) {
      setClause.push(`title = $${paramCount}`);
      values.push(updatedTask.title);
      paramCount++;
    }
    if (updatedTask.description) {
      setClause.push(`description = $${paramCount}`);
      values.push(updatedTask.description);
      paramCount++;
    }

    const TASK_ID_INDEX = paramCount;
    values.push(updatedTask.id);

    const query = `
      UPDATE tasks 
      SET ${setClause.join(', ')} 
      WHERE id = $${TASK_ID_INDEX} 
      RETURNING *
    `;

    try {
      const result = await this.pool.query(query, values);
      if (result.rows.length === 0) {
        throw new NotFoundException(`Task not found with id: ${updatedTask.id}`);
      }
      return result.rows[0] as Task;
    } catch (error) {
      this.handleQueryError(error);
      throw error;
    }
  }

  async toggleCompleted(id: string): Promise<void> {
    const query = `UPDATE tasks SET completed = NOT completed WHERE id = $1 RETURNING *`;

    try {
      const result = await this.pool.query(query, [id]);
      if (result.rowCount === 0) {
        throw new NotFoundException(`Task not found with id: ${id}`);
      }
    } catch (error) {
      this.handleQueryError(error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    const query = `DELETE FROM tasks WHERE id = $1`;

    try {
      const result = await this.pool.query(query, [id]);
      if (result.rowCount === 0) {
        throw new NotFoundException(`Task not found with id: ${id}`);
      }
    } catch (error) {
      this.handleQueryError(error);
      throw error;
    }
  }
}

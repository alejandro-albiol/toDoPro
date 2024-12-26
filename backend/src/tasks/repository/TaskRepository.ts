import { ITaskRepository } from './ITaskRepository.js';
import { pool } from '../../config/configDataBase.js';
import { DataBaseException } from '../../shared/exceptions/DataBaseException.js';
import { DataBaseErrorCode } from '../../shared/exceptions/enums/DataBaseErrorCode.enum.js';
import { IDatabaseError } from '../../shared/interfaces/IDataBaseError.js';
import { CreateTaskDto } from '../models/dtos/CreateTaskDto.js';
import { Task } from '../models/entities/Task.js';
import { UpdateTaskDto } from '../models/dtos/UpdateTaskDto.js';

export class TaskRepository implements ITaskRepository {

  async create(newTask: CreateTaskDto): Promise<Task> {
    try {
      const result = await pool.query(
        'INSERT INTO tasks (title, description, user_id) VALUES ($1, $2, $3) RETURNING *',
        [newTask.title, newTask.description, newTask.user_id],
      );
      return result.rows[0];
    } catch (error) {
      const dbError = error as IDatabaseError;
      
      if (dbError.code === DataBaseErrorCode.UNIQUE_VIOLATION) {
        throw new DataBaseException(
          'Unique constraint violation',
          DataBaseErrorCode.UNIQUE_VIOLATION
        );
      }
      
      if (dbError.code === DataBaseErrorCode.NOT_NULL_VIOLATION) {
        throw new DataBaseException(
          'Not null constraint violation',
          DataBaseErrorCode.NOT_NULL_VIOLATION
        );
      }
      
      throw new DataBaseException(
        'Unknown database error',
        DataBaseErrorCode.UNKNOWN_ERROR
      );
    }
  }

  async findById(id: string): Promise<Task | null> {
    try {
      const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
      return result.rows[0] || null;
    } catch (error) {
      const dbError = error as IDatabaseError;
      
      if (dbError.code === DataBaseErrorCode.UNDEFINED_COLUMN) {
        throw new DataBaseException(
          'Invalid column reference',
          DataBaseErrorCode.UNDEFINED_COLUMN
        );
      }

      throw new DataBaseException(
        'Unknown database error',
        DataBaseErrorCode.UNKNOWN_ERROR
      );
    }
  }

  async update(updatedTask: UpdateTaskDto): Promise<Task> {
    try {

      const existingTask = await this.findById(updatedTask.id);
      if (!existingTask) {
        throw new DataBaseException(
          'Task not found',
          DataBaseErrorCode.NOT_FOUND
        );
      }

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

      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      const dbError = error as IDatabaseError;
      
      if (dbError.code === DataBaseErrorCode.UNIQUE_VIOLATION) {
        throw new DataBaseException(
          'Unique constraint violation',
          DataBaseErrorCode.UNIQUE_VIOLATION
        );
      }

      if (dbError.code === DataBaseErrorCode.NOT_NULL_VIOLATION) {
        throw new DataBaseException(
          'Not null constraint violation',
          DataBaseErrorCode.NOT_NULL_VIOLATION
        );
      }

      throw new DataBaseException(
        'Unknown database error',
        DataBaseErrorCode.UNKNOWN_ERROR
      );
    }
  }

  async toggleCompleted(id: string): Promise<void> {
    try {
      await pool.query('UPDATE tasks SET completed = NOT completed WHERE id = $1', [id]);
    } catch (error) {
      const dbError = error as IDatabaseError;
      if (dbError.code === DataBaseErrorCode.NOT_FOUND) {
        throw new DataBaseException(
          'Task not found',
          DataBaseErrorCode.NOT_FOUND
        );
      }
      throw new DataBaseException(
        'Unknown database error',
        DataBaseErrorCode.UNKNOWN_ERROR
      );
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await pool.query(
        'DELETE FROM tasks WHERE id = $1',
        [id],
      );
    } catch (error) {
      const dbError = error as IDatabaseError;
      
      if (dbError.code === DataBaseErrorCode.FOREIGN_KEY_VIOLATION) {
        throw new DataBaseException(
          'Cannot delete due to existing references',
          DataBaseErrorCode.FOREIGN_KEY_VIOLATION
        );
      }

      throw new DataBaseException(
        'Unknown database error',
        DataBaseErrorCode.UNKNOWN_ERROR
      );
    }
  }
}

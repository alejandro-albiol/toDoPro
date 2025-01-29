import { ITaskRepository } from './i-task.repository.js';
import { pool } from '../../config/configDataBase.js';
import { DataBaseException } from '../../shared/models/exceptions/database.exception.js';
import { DataBaseErrorCode } from '../../shared/models/exceptions/enums/data-base-error-code.enum.js';
import { IDatabaseError } from '../../shared/models/interfaces/i-database-error.js';
import { CreateTaskDTO } from '../models/dtos/create-task.dto.js';
import { Task } from '../models/entities/task.entity.js';
import { UpdateTaskDTO } from '../models/dtos/update-task.dto.js';

export class TaskRepository implements ITaskRepository {

  async create(newTask: CreateTaskDTO): Promise<Task> {
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
      
      if (dbError.code === DataBaseErrorCode.INVALID_INPUT) {
        throw new DataBaseException(
          dbError.message || 'Invalid input',
          DataBaseErrorCode.INVALID_INPUT,
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

  async findAll(): Promise<Task[]> {
    try {
      const result = await pool.query('SELECT * FROM tasks');
      return result.rows || [];
    } catch (error) {
      const dbError = error as IDatabaseError;
      if (dbError.code === DataBaseErrorCode.NOT_FOUND) {
        throw new DataBaseException(
          'No tasks found',
          DataBaseErrorCode.NOT_FOUND
        );
      }
      throw new DataBaseException('Unknown database error', DataBaseErrorCode.UNKNOWN_ERROR);
    }
  }

  async findAllByUserId(userId: string): Promise<Task[]> {
    try {
      const result = await pool.query('SELECT * FROM tasks WHERE user_id = $1', [userId]);
      return result.rows || [];
    } catch (error) {
      const dbError = error as IDatabaseError;
      if (dbError.code === DataBaseErrorCode.NOT_FOUND) {
        throw new DataBaseException(
          'Task not found for user',
          DataBaseErrorCode.NOT_FOUND
        );
      }
      throw new DataBaseException('Unknown database error', DataBaseErrorCode.UNKNOWN_ERROR);
    }
  }

  async findById(id: string): Promise<Task | null> {
    try {
      const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
      return result.rows[0] || null;
    } catch (error) {
      const dbError = error as IDatabaseError;
      if (dbError.code === DataBaseErrorCode.NOT_FOUND) {
        throw new DataBaseException(
          'The task does not exist',
          DataBaseErrorCode.NOT_FOUND
        );
      }
      throw new DataBaseException('Unknown database error', DataBaseErrorCode.UNKNOWN_ERROR);
    }
  }

  async update(updatedTask: UpdateTaskDTO): Promise<Task> {
    try {
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

  async toggleCompleted(id: string): Promise<Task> {
    try {
      const result = await pool.query(
        'UPDATE tasks SET completed = NOT completed WHERE id = $1 RETURNING *',
        [id]
      );
      const toggledTask = result.rows[0] as Task;
      if (toggledTask.completed) {
        return toggledTask;
      }
      throw new DataBaseException(
        'Cannot mark task as completed',
        DataBaseErrorCode.UNKNOWN_ERROR
      );
    } catch (error) {
      const dbError = error as IDatabaseError;
      if (dbError.code === DataBaseErrorCode.NOT_FOUND) {
        throw new DataBaseException(
          'The task does not exist',
          DataBaseErrorCode.NOT_FOUND
        );
      }
      throw new DataBaseException('Unknown database error', DataBaseErrorCode.UNKNOWN_ERROR);
    }
  }

  async delete(id: string): Promise<null> {
    try {
      await pool.query(
        'DELETE FROM tasks WHERE id = $1',
        [id],
      );
      return null;
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
          'Task not found',
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

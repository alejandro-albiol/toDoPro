import { Task } from '../models/entities/Task.js';
import { CreateTaskDTO, UpdateTaskDTO } from '../models/dtos/TaskDTO.js';
import {
  SingleTaskResult,
  TaskListResult,
  NoDataResult,
} from '../models/responses/ProcessResult.js';
import { pool } from '../configuration/configDataBase.js';
import { TaskStatsResult } from '../models/responses/TaskStatsResult.js';
import { TaskStatsDTO } from '../models/dtos/TaskStatsDTO.js';

export class TaskServices {
  static async createTask(taskData: CreateTaskDTO): Promise<NoDataResult> {
    try {
      const result = await pool.query(
        `INSERT INTO tasks (title, description, user_id) 
         VALUES ($1, $2, $3) RETURNING *`,
        [taskData.title, taskData.description, taskData.user_id],
      );

      if (result.rows.length === 0) {
        return { isSuccess: false, message: 'Failed to create task.' };
      }
      return { isSuccess: true, message: 'Task created successfully.' };
    } catch (error) {
      console.error('Error in createTask:', error);
      return {
        isSuccess: false,
        message: 'Error creating task. Please try again later.',
      };
    }
  }

  static async deleteTask(taskId: string): Promise<NoDataResult> {
    try {
      const result = await pool.query(`DELETE FROM tasks WHERE id = $1`, [
        taskId,
      ]);

      if (result.rowCount === 0) {
        return { isSuccess: false, message: 'Task not found.' };
      } else {
        return { isSuccess: true, message: `Task with ID ${taskId} deleted.` };
      }
    } catch (error) {
      return {
        isSuccess: false,
        message: `Error deleting task: ${(error as Error).message}`,
      };
    }
  }

  static async updateTask(taskData: UpdateTaskDTO): Promise<SingleTaskResult> {
    try {
      const result = await pool.query(
        `UPDATE tasks 
         SET title = COALESCE($1, title),
             description = COALESCE($2, description),
             completed = COALESCE($3, completed)
         WHERE id = $4 
         RETURNING *`,
        [taskData.title, taskData.description, taskData.completed, taskData.id],
      );

      if (result.rows.length === 0) {
        return { isSuccess: false, message: 'Task not found.', data: null };
      }
      return {
        isSuccess: true,
        message: 'Task updated successfully.',
        data: result.rows[0] as Task,
      };
    } catch (error) {
      console.error('Error in updateTask:', error);
      return {
        isSuccess: false,
        message: 'Error updating task. Please try again later.',
        data: null,
      };
    }
  }

  static async getTaskById(taskId: string): Promise<SingleTaskResult> {
    try {
      const query = 'SELECT * FROM tasks WHERE id = $1';
      const result = await pool.query(query, [taskId]);

      if (result.rows.length === 0) {
        return {
          isSuccess: false,
          message: 'Task not found',
          data: null,
        };
      }

      return {
        isSuccess: true,
        message: 'Task retrieved successfully',
        data: result.rows[0] as Task,
      };
    } catch (error) {
      console.error('Error in getTaskById:', error);
      return {
        isSuccess: false,
        message: 'Error retrieving task',
        data: null,
      };
    }
  }

  static async getTasksByUserId(userId: string): Promise<TaskListResult> {
    try {
      const result = await pool.query(
        `SELECT id, title, description, completed, 
                creation_date, completed_at, user_id 
         FROM tasks 
         WHERE user_id = $1 
         ORDER BY completed ASC, creation_date DESC`,
        [userId],
      );

      return {
        isSuccess: true,
        message:
          result.rows.length > 0
            ? 'Tasks retrieved successfully.'
            : 'No tasks yet.',
        data: result.rows.length > 0 ? result.rows : [],
      };
    } catch (error) {
      console.error('Error in getTasksByUserId:', error);
      return {
        isSuccess: false,
        message: `Error getting tasks: ${(error as Error).message}`,
        data: null,
      };
    }
  }
  static async getAllTasks(): Promise<TaskListResult> {
    try {
      const result = await pool.query(`SELECT * FROM tasks`);

      if (result.rows.length === 0) {
        return { isSuccess: false, message: 'No tasks found.', data: null };
      } else {
        return {
          isSuccess: true,
          message: 'All tasks retrieved successfully.',
          data: result.rows,
        };
      }
    } catch (error) {
      return {
        isSuccess: false,
        message: `Error getting all tasks: ${(error as Error).message}`,
        data: null,
      };
    }
  }

  static async toggleTaskComplete(taskId: string): Promise<SingleTaskResult> {
    try {
      const result = await pool.query(
        `UPDATE tasks 
         SET completed = NOT completed 
         WHERE id = $1 
         RETURNING *`,
        [taskId],
      );

      if (result.rows.length === 0) {
        return { isSuccess: false, message: 'Task not found.', data: null };
      }

      const task: Task = result.rows[0] as Task;
      const status = task.completed ? 'completed' : 'uncompleted';
      return {
        isSuccess: true,
        message: `Task marked as ${status}.`,
        data: task,
      };
    } catch (error) {
      return {
        isSuccess: false,
        message: `Error toggling task: ${(error as Error).message}`,
        data: null,
      };
    }
  }

  static async getUserTaskStats(userId: string): Promise<TaskStatsResult> {
    try {
      const result = await pool.query<TaskStatsDTO>(
        `SELECT 
          COUNT(*)::integer as total,
          COUNT(CASE WHEN completed = true THEN 1 END)::integer as completed,
          COUNT(CASE WHEN completed = false THEN 1 END)::integer as pending
         FROM tasks 
         WHERE user_id = $1`,
        [userId],
      );

      if (result.rows.length === 0) {
        return {
          isSuccess: false,
          message: 'No statistics found.',
          data: null,
        };
      }

      return {
        isSuccess: true,
        message: 'Statistics retrieved successfully.',
        data: result.rows[0],
      };
    } catch (error) {
      console.error('Error in getUserTaskStats:', error);
      return {
        isSuccess: false,
        message: 'Error retrieving statistics.',
        data: null,
      };
    }
  }

  static async getPendingTasks(userId: string): Promise<Task[]> {
    const query = `
      SELECT id, title, description
      FROM tasks
      WHERE user_id = $1 AND completed = false
      ORDER BY creation_date ASC
    `;

    const result = await pool.query(query, [userId]);
    return result.rows as Task[];
  }
}

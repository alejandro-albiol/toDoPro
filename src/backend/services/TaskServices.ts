import { Task } from '../models/Task';
import { ProcessResult } from '../models/ProcessResult';
import pool from '../configuration/configDataBase.js';

export class TaskServices {
  static async createTask(task: Task, userId: string): Promise<ProcessResult> {
    try {
      const result = await pool.query(
        `INSERT INTO tasks (title, description, user_id) VALUES ($1, $2, $3) RETURNING *`,
        [task.title, task.description, userId],
      );

      if (result.rows.length === 0) {
        return { isSuccess: false, message: 'Failed to create task.' };
      } else {
        return { isSuccess: true, message: 'Task created successfully.' };
      }
    } catch (error) {
      return {
        isSuccess: false,
        message: `Error creating task: ${(error as Error).message}`,
      };
    }
  }

  static async deleteTask(taskId: string): Promise<ProcessResult> {
    try {
      const result = await pool.query(`DELETE FROM tasks WHERE id = $1`, [
        taskId,
      ]);

      if (result.rows.length === 0) {
        return { isSuccess: false, message: 'Failed to delete task.' };
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

  static async updateTask(taskId: number, task: Task): Promise<ProcessResult> {
    try {
      const result = await pool.query(
        `UPDATE tasks 
         SET title = $1, 
             description = $2,
             completed = $3
         WHERE id = $4 
         RETURNING *`,
        [task.title, task.description, task.completed, taskId],
      );

      if (result.rows.length === 0) {
        return { isSuccess: false, message: 'Task not found.' };
      }
      return {
        isSuccess: true,
        message: `Task updated successfully.`,
        data: JSON.stringify(result.rows[0]),
      };
    } catch (error) {
      return {
        isSuccess: false,
        message: `Error updating task: ${(error as Error).message}`,
      };
    }
  }

  static async getTaskById(taskId: string): Promise<ProcessResult> {
    try {
      const result = await pool.query(`SELECT * FROM tasks WHERE id = $1`, [
        taskId,
      ]);

      if (result.rows.length === 0) {
        return { isSuccess: false, message: 'Task not found.' };
      } else {
        return {
          isSuccess: true,
          message: 'Task retrieved successfully.',
          data: JSON.stringify(result.rows[0]),
        };
      }
    } catch (error) {
      return {
        isSuccess: false,
        message: `Error getting task by ID: ${(error as Error).message}`,
      };
    }
  }

  static async getTasksByUserId(userId: string): Promise<ProcessResult> {
    try {
      const result = await pool.query(
        `SELECT id, title, description, completed, 
                creation_date, user_id 
         FROM tasks 
         WHERE user_id = $1 
         ORDER BY completed ASC, creation_date DESC`,
        [userId],
      );

      return {
        isSuccess: true,
        message: result.rows.length
          ? 'Tasks retrieved successfully.'
          : 'No tasks found.',
        data: JSON.stringify(result.rows),
      };
    } catch (error) {
      return {
        isSuccess: false,
        message: `Error getting tasks: ${(error as Error).message}`,
      };
    }
  }
  static async getAllTasks(): Promise<ProcessResult> {
    try {
      const result = await pool.query(`SELECT * FROM tasks`);

      if (result.rows.length === 0) {
        return { isSuccess: false, message: 'No tasks found.' };
      } else {
        return {
          isSuccess: true,
          message: 'All tasks retrieved successfully.',
          data: JSON.stringify(result.rows),
        };
      }
    } catch (error) {
      return {
        isSuccess: false,
        message: `Error getting all tasks: ${(error as Error).message}`,
      };
    }
  }

  static async toggleTaskComplete(taskId: string): Promise<ProcessResult> {
    try {
      const result = await pool.query(
        `UPDATE tasks 
         SET completed = NOT completed 
         WHERE id = $1 
         RETURNING *`,
        [taskId],
      );

      if (result.rows.length === 0) {
        return { isSuccess: false, message: 'Task not found.' };
      }

      const task = result.rows[0] as Task;
      const status = task.completed ? 'completed' : 'uncompleted';
      return {
        isSuccess: true,
        message: `Task marked as ${status}.`,
        data: JSON.stringify(task),
      };
    } catch (error) {
      return {
        isSuccess: false,
        message: `Error toggling task: ${(error as Error).message}`,
      };
    }
  }
}

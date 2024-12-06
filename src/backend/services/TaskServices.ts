import { Task } from '../models/Task';
import { SingleTaskResult, TaskListResult, NoDataResult } from '../models/ProcessResult';
import pool from '../configuration/configDataBase.js';

export class TaskServices {
  static async createTask(task: Task, userId: string): Promise<NoDataResult> {
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

  static async deleteTask(taskId: string): Promise<NoDataResult> {
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

  static async updateTask(taskId: number, task: Task): Promise<SingleTaskResult> {
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
        return { isSuccess: false, message: 'Task not found.', data: null };
      }
      return {
        isSuccess: true,
        message: `Task updated successfully.`,
        data: result.rows[0],
      };
    } catch (error) {
      return {
        isSuccess: false,
        message: `Error updating task: ${(error as Error).message}`,
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
          message: "Task not found",
          data: null
        };
      }

      return {
        isSuccess: true,
        message: "Task retrieved successfully",
        data: result.rows[0]
      };
    } catch (error) {
      console.error('Error in getTaskById:', error);
      return {
        isSuccess: false,
        message: "Error retrieving task",
        data: null
      };
    }
  }

  static async getTasksByUserId(userId: string): Promise<TaskListResult> {
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
        message: result.rows.length > 0 
          ? 'Tasks retrieved successfully.' 
          : 'No tasks yet.',
        data: result.rows.length > 0 ? result.rows : []
      };
    } catch (error) {
      console.error('Error in getTasksByUserId:', error);
      return {
        isSuccess: false,
        message: `Error getting tasks: ${(error as Error).message}`,
        data: null
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
}

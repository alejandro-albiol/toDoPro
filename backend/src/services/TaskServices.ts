import { pool } from "../configuration/configDataBase";
import { CreateTaskDTO, UpdateTaskDTO } from "../models/dtos/TaskDTO";
import { TaskStatsDTO } from "../models/dtos/TaskStatsDTO";
import { Task } from "../models/entities/Task";

export class TaskServices {
  static async createTask(taskData: CreateTaskDTO): Promise<Task> {
    try {
      const result = await pool.query(
        `INSERT INTO tasks (title, description, user_id) 
         VALUES ($1, $2, $3) RETURNING *`,
        [taskData.title, taskData.description, taskData.user_id],
      );
      if (result.rows.length === 0) {
        throw new Error('Failed to create task.');
      }
      return result.rows[0] as Task;
    } catch (error) {
      console.error('Error in createTask:', error);
      throw error;
    }
  }

  static async deleteTask(taskId: string): Promise<Task> {
    try {
      const result = await pool.query(`DELETE FROM tasks WHERE id = $1`, [
        taskId,
      ]);

      if (result.rowCount === 0) {
        throw new Error('Task not found.');
      } else {
        return result.rows[0] as Task;
      }
    } catch (error) {
      throw error;
    }
  }

  static async updateTask(taskData: UpdateTaskDTO): Promise<Task> {
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
        throw new Error('Task not found.');
      }
      return result.rows[0] as Task;
    } catch (error) {
      console.error('Error in updateTask:', error);
      throw error;
    }
  }

  static async getTaskById(taskId: string): Promise<Task> {
    try {
      const query = 'SELECT * FROM tasks WHERE id = $1';
      const result = await pool.query(query, [taskId]);

      if (result.rows.length === 0) {
        throw new Error('Task not found');
      }

      return result.rows[0] as Task;
    } catch (error) {
      console.error('Error in getTaskById:', error);
      throw error;
    }
  }

  static async getTasksByUserId(userId: string): Promise<Task[]> {
    try {
      const result = await pool.query(
        `SELECT id, title, description, completed, 
                creation_date, completed_at, user_id 
         FROM tasks 
         WHERE user_id = $1 
         ORDER BY completed ASC, creation_date DESC`,
        [userId],
      );

      return result.rows as Task[];
    } catch (error) {
      throw error;
    }
  }

  static async getAllTasks(): Promise<Task[]> {
    try {
      const result = await pool.query(`SELECT * FROM tasks`);

      if (result.rows.length === 0) {
        throw new Error('No tasks found.');
      } else {
        return result.rows as Task[];
      }
    } catch (error) {
      throw error;
    }
  }

  static async toggleTaskComplete(taskId: string): Promise<Task> {
    try {
      const result = await pool.query(
        `UPDATE tasks 
         SET completed = NOT completed 
         WHERE id = $1 
         RETURNING *`,
        [taskId],
      );

      if (result.rows.length === 0) {
        throw new Error('Task not found.');
      }

      const task: Task = result.rows[0] as Task;
      const status = task.completed ? 'completed' : 'uncompleted';
      return task;
    } catch (error) {
      throw error;
    }
  }

  static async getUserTaskStats(userId: string): Promise<TaskStatsDTO> {
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
        throw new Error('No statistics found.');
      }

      return result.rows[0] as TaskStatsDTO;
    } catch (error) {
      throw error;
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

import { Task } from "../models/Task";
import { ProcessResult } from '../models/ProcessResult';
import pool from "../configuration/configDataBase.js";

export class TaskServices {
    static async createTask(task: Task, userId: string): Promise<ProcessResult> {
        try {
            const result = await pool.query(
                `INSERT INTO tasks (title, description, user_id) VALUES ($1, $2, $3) RETURNING *`,
                [task.title, task.description, userId]
            );

            if (result.rows.length === 0) {
                return { isSuccess: false, message: 'Failed to create task.' };
            } else {
                return { isSuccess: true, message: 'Task created successfully.' };
            }
        } catch (error) {
            return { isSuccess: false, message: 'Error creating task.' };
        }
    }

    static async deleteTask(taskId: string): Promise<ProcessResult> {
        try {
            const result = await pool.query(
                `DELETE FROM tasks WHERE id = $1`,
                [taskId]
            );

            if (result.rows.length === 0) {
                return { isSuccess: false, message: "Failed to delete task." };
            } else {
                return { isSuccess: true, message: `Task with ID ${taskId} deleted.` };
            }
        } catch (error) {
            return { isSuccess: false, message: 'Error deleting task.' };
        }
    }

    static async updateTask(taskId: number, task: Task): Promise<ProcessResult> {
        try {
            const result = await pool.query(
                `UPDATE tasks SET title = $1, description = $2 WHERE id = $3 RETURNING *`,
                [task.title, task.description, taskId]
            );

            if (result.rows.length === 0) {
                return { isSuccess: false, message: "Failed to update task." };
            } else {
                return { isSuccess: true, message: `Task with ID ${taskId} updated.` };
            }
        } catch (error) {
            return { isSuccess: false, message: 'Error updating task.' };
        }
    }

    static async getTaskById(taskId: string): Promise<ProcessResult> {
        try {
            const result = await pool.query(
                `SELECT * FROM tasks WHERE id = $1`,
                [taskId]
            );

            if (result.rows.length === 0) {
                return { isSuccess: false, message: 'Task not found.' };
            } else {
                return { isSuccess: true, message: 'Task retrieved successfully.', result: result.rows[0] };
            }
        } catch (error) {
            return { isSuccess: false, message: 'Error getting task by ID.' };
        }
    }

    static async getTasksByUserId(userId: string): Promise<ProcessResult> {
        try {
            const result = await pool.query(
                `SELECT * FROM tasks WHERE user_id = $1`,
                [userId]
            );

            if (result.rows.length === 0) {
                return { isSuccess: false, message: 'No tasks found for user.' };
            } else {
                return { isSuccess: true, message: 'Tasks retrieved successfully.', result: result.rows };
            }
        } catch (error) {
            return { isSuccess: false, message: 'Error getting tasks by user ID.' };
        }
    }
    static async getAllTasks(): Promise<ProcessResult> {
        try {
            const result = await pool.query(
                `SELECT * FROM tasks`
            );

            if (result.rows.length === 0) {
                return { isSuccess: false, message: 'No tasks found.' };
            } else {
                return { isSuccess: true, message: 'All tasks retrieved successfully.', result: result.rows };
            }
        } catch (error) {
            return { isSuccess: false, message: 'Error getting all tasks.' };
        }
    }
}
import { ProcessResult } from '../models/ProcessResult.js';
import { Task } from '../models/Task.js';
import { User } from '../models/User.js';
import { TaskServices } from '../services/TaskServices.js';

export class TaskController {

  static async newTask(task:Task, userId:string): Promise<ProcessResult> {
    try {
      const result = await TaskServices.createTask(task, userId);
      return result;
    } catch (error) {
      return { isSuccess: false, message: 'Error creating task.' };
    }
  }

  static async getTaskById(id: string): Promise<ProcessResult> {
    try {
      const result = await TaskServices.getTaskById(id);
      return result;
    } catch (error) {
      console.error('Error retrieving task by ID:', error);
      return { isSuccess: false, message: 'Error retrieving task by ID.' };
    }
  }

  static async getAllTasks(): Promise<ProcessResult> {
    try {
      const result = await TaskServices.getAllTasks();
      return result;
    } catch (error) {
      console.error('Error retrieving all tasks:', error);
      return { isSuccess: false, message: 'Error retrieving all tasks.' };
    }
  }

  static async updateTask(taskId: number, task: Task): Promise<ProcessResult> {
    try {
      if (!taskId) {
        return { isSuccess: false, message: 'Task ID is required.' };
      }
      const result = await TaskServices.updateTask(taskId, task);
      return result;
    } catch (error) {
      console.error('Error updating task:', error);
      return { isSuccess: false, message: 'Error updating task.' };
    }
  }

  static async deleteTask(taskId: string): Promise<ProcessResult> {
    try {
      if (!taskId) {
        return { isSuccess: false, message: 'Task ID is required.' };
      }
      const result = await TaskServices.deleteTask(taskId);
      return result;
    } catch (error) {
      console.error('Error deleting task:', error);
      return { isSuccess: false, message: 'Error deleting task.' };
    }
  }
  static async getTasksByUserId(userId: string): Promise<ProcessResult> {
    try {
      const result = await TaskServices.getTasksByUserId(userId);
      return result;
    } catch (error) {
      console.error('Error retrieving tasks by user ID:', error);
      return { isSuccess: false, message: 'Error retrieving tasks by user ID.' };
    }
  }
}

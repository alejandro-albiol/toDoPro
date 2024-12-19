import { CreateTaskDTO, UpdateTaskDTO } from "../models/dtos/TaskDTO.js";
import { TaskStatsDTO } from "../models/dtos/TaskStatsDTO.js";
import { Task } from "../models/entities/Task.js";
import { TaskServices } from "../services/TaskServices.js";

export class TaskController {
  static async newTask(taskData: CreateTaskDTO): Promise<Task> {
    try {
      return await TaskServices.createTask(taskData);
    } catch (error) {
      console.error('Error creating task.', error);
      throw error;
    }
  }

  static async getTaskById(taskId: string): Promise<Task> {
    try {
      return await TaskServices.getTaskById(taskId);
    } catch (error) {
      console.error('Error in getTaskById:', error);
      throw error;
    }
  }

  static async getAllTasks(): Promise<Task[]> {
    try {
      return await TaskServices.getAllTasks();
    } catch (error) {
      console.error('Error retrieving all tasks:', error);
      throw error;
    }
  }

  static async updateTask(taskData: UpdateTaskDTO): Promise<Task> {
    try {
      if (!taskData.id) {
        throw new Error('Task ID is required.');
      }
      return await TaskServices.updateTask(taskData);
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  static async deleteTask(taskId: string): Promise<Task> {
    try {
      if (!taskId) {
        throw new Error('Task ID is required.');
      }
      return await TaskServices.deleteTask(taskId);
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }

  static async getTasksByUserId(userId: string): Promise<Task[]> {
    try {
      return await TaskServices.getTasksByUserId(userId);
    } catch (error) {
      console.error('Error retrieving tasks by user ID:', error);
      throw error;
    }
  }

  static async toggleCompletion(taskId: string): Promise<Task> {
    try {
      if (!taskId) {
        throw new Error('Task ID is required.');
      }
      return await TaskServices.toggleTaskComplete(taskId);
    } catch (error) {
      console.error('Error completing task:', error);
      throw error;
    }
  }

  static async getUserTaskStats(userId: string): Promise<TaskStatsDTO> {
    try {
      if (!userId) {
        throw new Error('User ID is required.');
      }
      return await TaskServices.getUserTaskStats(userId);
    } catch (error) {
      console.error('Error retrieving user task stats:', error);
      throw error;
    }
  }
}

import { CreateTaskDTO, UpdateTaskDTO } from "../models/dtos/TaskDTO.js";
import { SingleTaskResult, TaskListResult } from "../models/responses/ProcessResult.js";
import { NoDataResult } from "../models/responses/ProcessResult.js";
import { TaskStatsResult } from "../models/responses/TaskStatsResult.js";
import { TaskServices } from "../services/TaskServices.js";

export class TaskController {
  static async newTask(taskData: CreateTaskDTO): Promise<NoDataResult> {
    try {
      return await TaskServices.createTask(taskData);
    } catch (error) {
      console.error('Error creating task.', error);
      return {
        isSuccess: false,
        message: 'Error creating task.',
      };
    }
  }

  static async getTaskById(taskId: string): Promise<SingleTaskResult> {
    try {
      return await TaskServices.getTaskById(taskId);
    } catch (error) {
      console.error('Error in getTaskById:', error);
      return {
        isSuccess: false,
        message: 'Error retrieving task',
        data: null,
      };
    }
  }

  static async getAllTasks(): Promise<TaskListResult> {
    try {
      return await TaskServices.getAllTasks();
    } catch (error) {
      console.error('Error retrieving all tasks:', error);
      return {
        isSuccess: false,
        message: 'Error retrieving all tasks.',
        data: null,
      };
    }
  }

  static async updateTask(taskData: UpdateTaskDTO): Promise<SingleTaskResult> {
    try {
      if (!taskData.id) {
        return {
          isSuccess: false,
          message: 'Task ID is required.',
          data: null,
        };
      }
      return await TaskServices.updateTask(taskData);
    } catch (error) {
      console.error('Error updating task:', error);
      return {
        isSuccess: false,
        message: 'Error updating task.',
        data: null,
      };
    }
  }

  static async deleteTask(taskId: string): Promise<NoDataResult> {
    try {
      if (!taskId) {
        return {
          isSuccess: false,
          message: 'Task ID is required.',
        };
      }
      return await TaskServices.deleteTask(taskId);
    } catch (error) {
      console.error('Error deleting task:', error);
      return {
        isSuccess: false,
        message: 'Error deleting task.',
      };
    }
  }

  static async getTasksByUserId(userId: string): Promise<TaskListResult> {
    try {
      return await TaskServices.getTasksByUserId(userId);
    } catch (error) {
      console.error('Error retrieving tasks by user ID:', error);
      return {
        isSuccess: false,
        message: 'Error retrieving tasks by user ID.',
        data: null,
      };
    }
  }

  static async toggleCompletion(taskId: string): Promise<SingleTaskResult> {
    try {
      if (!taskId) {
        return {
          isSuccess: false,
          message: 'Task ID is required.',
          data: null,
        };
      }
      return await TaskServices.toggleTaskComplete(taskId);
    } catch (error) {
      console.error('Error completing task:', error);
      return {
        isSuccess: false,
        message: 'Error completing task.',
        data: null,
      };
    }
  }

  static async getUserTaskStats(userId: string): Promise<TaskStatsResult> {
    try {
      if (!userId) {
        return {
          isSuccess: false,
          message: 'User ID is required.',
          data: null,
        };
      }
      return await TaskServices.getUserTaskStats(userId);
    } catch (error) {
      console.error('Error retrieving user task stats:', error);
      return {
        isSuccess: false,
        message: 'Error retrieving task statistics.',
        data: null,
      };
    }
  }
}

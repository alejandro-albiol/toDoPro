import { IBaseService } from '../../shared/models/interfaces/base/i-service.js';
import { Task } from '../models/entities/task.entity.js';
import { CreateTaskDTO } from '../models/dtos/create-task.dto.js';
import { UpdateTaskDTO } from '../models/dtos/update-task.dto.js';

/**
 * Interface representing the task service.
 * Extends the base service interface with additional task-specific methods.
 * 
 * @extends IBaseService<Task, CreateTaskDTO, UpdateTaskDTO>
 */
export interface ITaskService extends IBaseService<Task, CreateTaskDTO, UpdateTaskDTO> {
  /**
   * Finds all tasks associated with a specific user ID.
   * 
   * @param userId - The ID of the user whose tasks are to be retrieved.
   * @returns A promise that resolves to an array of tasks or null if no tasks are found.
   */
  findAllByUserId(userId: string): Promise<Task[] | null>;

  /**
   * Toggles the completion status of a task.
   * 
   * @param id - The ID of the task to be toggled.
   * @returns A promise that resolves when the operation is complete.
   */
  toggleCompleted(id: string): Promise<void>;

  /**
   * Finds all completed tasks associated with a specific user ID.
   * 
   * @param userId - The ID of the user whose completed tasks are to be retrieved.
   * @returns A promise that resolves to an array of completed tasks or null if no tasks are found.
   */
  findAllCompletedByUserId(userId: string): Promise<Task[] | null>;
}

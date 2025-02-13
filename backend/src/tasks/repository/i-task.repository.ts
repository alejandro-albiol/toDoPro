import { IBaseRepository } from "../../shared/models/interfaces/base/i-repository.js";
import { CreateTaskDTO } from "../models/dtos/create-task.dto.js";
import { UpdateTaskDTO } from "../models/dtos/update-task.dto.js";
import { Task } from "../models/entities/task.entity.js";

/**
 * Interface representing a repository for managing tasks.
 * Extends the base repository interface with additional methods specific to tasks.
 *
 * @extends {IBaseRepository<Task, CreateTaskDTO, UpdateTaskDTO>}
 */
export interface ITaskRepository extends IBaseRepository<Task, CreateTaskDTO, UpdateTaskDTO> {
  /**
   * Toggles the completion status of a task.
   *
   * @param {string} id - The ID of the task to toggle.
   * @returns {Promise<Task>} A promise that resolves to the updated task.
   */
  toggleCompleted(id: string): Promise<void>;

  /**
   * Finds all tasks associated with a specific user.
   *
   * @param {string} userId - The ID of the user whose tasks are to be retrieved.
   * @returns {Promise<Task[]>} A promise that resolves to an array of tasks.
   */
  findAllByUserId(userId: string): Promise<Task[] | null>;

  /**
   * Finds all completed tasks associated with a specific user.
   *
   * @param {string} userId - The ID of the user whose completed tasks are to be retrieved.
   * @returns {Promise<Task[]>} A promise that resolves to an array of completed tasks.
   */
  findAllCompletedByUserId(userId: string): Promise<Task[] | null>;
}
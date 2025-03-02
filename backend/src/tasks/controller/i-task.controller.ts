import { Request, Response } from 'express';
import { IBaseController } from '../../shared/models/interfaces/base/i-controller.js';

/**
 * Interface for Task Controller
 * Extends the base controller interface with specific methods for Task entity.
 */
export interface ITaskController extends IBaseController {
  /**
   * Toggles the completed status of a task.
   * @param req - The request object containing the task ID.
   * @param res - The response object used to send the result.
   * @returns A promise that resolves to the updated Task.
   */
  toggleCompleted(req: Request, res: Response): Promise<void>;

  /**
   * Finds all tasks associated with a specific user.
   * @param req - The request object containing the user ID.
   * @param res - The response object used to send the result.
   * @returns A promise that resolves to an array of Tasks.
   */
  findAllByUserId(req: Request, res: Response): Promise<void>;

  /**
   * Finds all completed tasks associated with a specific user ID.
   *
   * @param req - The request object containing the user ID.
   * @param res - The response object to send the result.
   * @returns A promise that resolves to an array of completed tasks or null if no tasks are found.
   */
  findAllCompletedByUserId(req: Request, res: Response): Promise<void>;
}

import { Request, Response } from 'express';

/**
 * Interface representing the base controller with common CRUD operations.
 */
export interface IBaseController {
  /**
   * Creates a new resource.
   * @param req - The request object.
   * @param res - The response object.
   * @returns A promise that resolves when the operation is complete.
   */
  create(req: Request, res: Response): Promise<void>;

  /**
   * Retrieves all resources.
   * @param req - The request object.
   * @param res - The response object.
   * @returns A promise that resolves when the operation is complete.
   */
  findAll(req: Request, res: Response): Promise<void>;

  /**
   * Retrieves a resource by its ID.
   * @param req - The request object.
   * @param res - The response object.
   * @returns A promise that resolves when the operation is complete.
   */
  findById(req: Request, res: Response): Promise<void>;

  /**
   * Updates an existing resource.
   * @param req - The request object.
   * @param res - The response object.
   * @returns A promise that resolves when the operation is complete.
   */
  update(req: Request, res: Response): Promise<void>;

  /**
   * Deletes a resource.
   * @param req - The request object.
   * @param res - The response object.
   * @returns A promise that resolves when the operation is complete.
   */
  delete(req: Request, res: Response): Promise<void>;
}

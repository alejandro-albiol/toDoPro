/**
 * Interface representing a base service with common CRUD operations.
 *
 * @template T - The type of the entity.
 * @template CreateDTO - The type of the data transfer object used for creating an entity.
 * @template UpdateDTO - The type of the data transfer object used for updating an entity. Defaults to a partial of T.
 */
export interface IBaseService<T, CreateDTO, UpdateDTO = Partial<T>> {
  /**
   * Finds an entity by its ID.
   *
   * @param id - The ID of the entity to find.
   * @returns A promise that resolves to a partial entity or null if not found.
   */
  findById(id: string): Promise<Partial<T> | null>;

  /**
   * Retrieves all entities.
   *
   * @returns A promise that resolves to an array of entities.
   */
  findAll(): Promise<T[] | null>;

  /**
   * Creates a new entity.
   *
   * @param dto - The data transfer object containing the details of the entity to create.
   * @returns A promise that resolves to a partial entity.
   */
  create(dto: CreateDTO): Promise<Partial<T>>;

  /**
   * Updates an existing entity.
   *
   * @param dto - The data transfer object containing the updated details of the entity.
   * @returns A promise that resolves to a partial entity.
   */
  update(dto: UpdateDTO): Promise<Partial<T>>;

  /**
   * Deletes an entity by its ID.
   *
   * @param id - The ID of the entity to delete.
   * @returns A promise that resolves to a boolean indicating whether the deletion was successful.
   */
  delete(id: string): Promise<void>;
}

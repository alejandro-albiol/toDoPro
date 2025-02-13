/**
 * Interface representing a base repository with common CRUD operations.
 *
 * @template T - The type of the entity.
 * @template CreateDTO - The type of the data transfer object for creating an entity.
 * @template UpdateDTO - The type of the data transfer object for updating an entity.
 */
export interface IBaseRepository<T, CreateDTO, UpdateDTO> {
  /**
   * Finds an entity by its ID.
   *
   * @param id - The ID of the entity to find.
   * @returns A promise that resolves to a partial entity or null if not found.
   */
  findById(id: string): Promise<Partial<T> | null>;

  /**
   * Finds all entities.
   *
   * @returns A promise that resolves to an array of entities or an empty array if none are found.
   */
  findAll(): Promise<T[] | null>;

  /**
   * Creates a new entity.
   *
   * @param dto - The data transfer object containing the information to create the entity.
   * @returns A promise that resolves to the created partial entity.
   */
  create(dto: CreateDTO): Promise<Partial<T>>;

  /**
   * Updates an existing entity.
   *
   * @param dto - The data transfer object containing the updated information for the entity.
   * @returns A promise that resolves to the updated partial entity.
   */
  update(dto: UpdateDTO): Promise<Partial<T>>;

  /**
   * Deletes an entity by its ID.
   *
   * @param id - The ID of the entity to delete.
   * @returns A promise that resolves when the entity is deleted.
   */
  delete(id: string): Promise<void>;
}

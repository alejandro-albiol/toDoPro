export interface IBaseRepository<T, CreateDTO> {
  findById(id: string): Promise<T | undefined>;
  create(dto: CreateDTO): Promise<T>;
  update(id: string, entity: Partial<T>): Promise<T>;
  delete(id: string): Promise<boolean>;
}

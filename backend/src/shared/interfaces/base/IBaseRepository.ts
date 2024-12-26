export interface IBaseRepository<T, CreateDTO, UpdateDTO, UpdatedDTO = Partial<T>> {
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(dto: CreateDTO): Promise<T>;
  update(dto: UpdateDTO): Promise<UpdatedDTO>;
  delete(id: string): Promise<void>;
}

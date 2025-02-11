export interface IBaseRepository<T, CreateDTO, UpdateDTO> {
  findById(id: string): Promise<Partial<T> | null>;
  findAll(): Promise<T[] | []>;
  create(dto: CreateDTO): Promise<Partial<T>>;
  update(dto: UpdateDTO): Promise<Partial<T>>;
  delete(id: string): Promise<void>;
}

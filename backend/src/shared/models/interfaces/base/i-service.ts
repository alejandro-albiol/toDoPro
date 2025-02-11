export interface IBaseService<T, CreateDTO, UpdateDTO = Partial<T>> {
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[] | []>;
  create(dto: CreateDTO): Promise<Partial<T>>;
  update(dto: UpdateDTO): Promise<Partial<T>>;
  delete(id: string): Promise<boolean>;
} 
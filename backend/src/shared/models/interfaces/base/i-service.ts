export interface IBaseService<T, CreateDTO, UpdateDTO = Partial<T>> {
  findById(id: string): Promise<T | null>;
  create(dto: CreateDTO): Promise<T>;
  update(dto: UpdateDTO): Promise<UpdateDTO>;
  delete(id: string): Promise<boolean>;
} 
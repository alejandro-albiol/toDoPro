export interface IBaseService<T, CreateDTO, UpdateDTO = Partial<T>, UpdatedDTO = Partial<T>> {
  findById(id: string): Promise<T | null>;
  create(dto: CreateDTO): Promise<T | null>;
  update(dto: UpdateDTO): Promise<UpdatedDTO>;
  delete(id: string): Promise<void>;
} 
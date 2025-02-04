export interface IBaseRepository<T, CreateDTO, UpdateDTO> {
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[] | []>;
  create(dto: CreateDTO): Promise<T>;
  update(dto: UpdateDTO): Promise<UpdateDTO>;
  delete(id: string): Promise<boolean>;
}

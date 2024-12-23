export interface IEmailSearchable<T> {
  findByEmail(email: string): Promise<T | undefined>;
}

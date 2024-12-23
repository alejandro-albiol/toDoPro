export interface IUsernameSearchable<T> {
  findByUsername(username: string): Promise<T | undefined>;
}

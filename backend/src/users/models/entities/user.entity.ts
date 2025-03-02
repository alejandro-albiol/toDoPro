export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
}

export type UserWithoutPassword = Omit<User, 'password'>;

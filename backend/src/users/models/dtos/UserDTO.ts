export interface CreateUserDTO {
  username: string;
  email: string;
  password: string;
}

export interface UpdateUserDTO {
  id: string;
  username?: string;
  email?: string;
}

export interface UserUpdatedDTO{
  id: string;
  username: string;
  email: string;
}

export interface ChangePasswordDTO {
  userId: string;
  currentPassword: string;
  newPassword: string;
}
export interface LoginDTO {
  username: string;
  password: string;
}

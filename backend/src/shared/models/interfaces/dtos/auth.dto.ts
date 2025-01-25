//TODO: MOVE TO SHARED FOLDER (AUTHENTICATION)
export interface ChangePasswordDTO {
  userId: string;
  currentPassword: string;
  newPassword: string;
}
export interface LoginDTO {
  username: string;
  password: string;
}

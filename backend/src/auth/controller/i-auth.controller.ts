import { LoginDTO } from "../models/dtos/login.dto.js";
import { ChangePasswordDTO } from "../models/dtos/change-password.dto.js";

export interface IAuthController{
    login(credentials: LoginDTO): Promise<{ token: string }>;
    changePassword(token: string, changePasswordDTO: ChangePasswordDTO): Promise<void>;
}
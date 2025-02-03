import { AuthService } from '../service/auth.service.js';
import { LoginDTO } from '../models/dtos/login.dto.js';
import { ChangePasswordDTO } from '../models/dtos/change-password.dto.js';
import { AuthException } from '../exceptions/base-auth.exception.js';
import { DataBaseException } from '../../shared/database/exceptions/database.exception.js';
import { InvalidCredentialsException } from '../exceptions/invalid-credentials.exception.js';

export class AuthController {
    constructor(private authService: AuthService) {}

    async login(credentials: LoginDTO): Promise<{ token: string }> {
        try {
            if (!credentials) {
                throw new InvalidCredentialsException('Credentials are required');
            }
            const loginDto = await this.toLoginDto(credentials);
            const token = await this.authService.login(loginDto);
            return { token };
        } catch (error) {
            if (error instanceof AuthException || error instanceof DataBaseException) {
                throw error;
            }
            throw new InvalidCredentialsException('An unknown error occurred during login');
        }
    }

    async changePassword(token: string, changePasswordDTO: ChangePasswordDTO): Promise<void> {
        try {
            if (!changePasswordDTO) {
                throw new InvalidCredentialsException('Password data is required');
            }
            await this.authService.changePassword(token, changePasswordDTO);
        } catch (error) {
            if (error instanceof AuthException || error instanceof DataBaseException) {
                throw error;
            }
            console.error(error);
            throw new InvalidCredentialsException('An unknown error occurred while changing password');
        }
    }

    private async toLoginDto(credentials: LoginDTO): Promise<LoginDTO> {
        try {
            return {
                username: credentials.username.toLowerCase(),
                password: credentials.password
            };
        } catch (error) {
            throw new InvalidCredentialsException('Invalid credentials format');
        }
    }
}
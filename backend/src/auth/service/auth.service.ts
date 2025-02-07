import { HashService } from '../../shared/services/hash.service.js';
import { CreateUserDTO } from '../../users/models/dtos/create-user.dto.js';
import { UserService } from '../../users/service/user.service.js';
import { InvalidCredentialsException } from '../exceptions/invalid-credentials.exception.js';
import { LoginDTO } from '../models/dtos/login.dto.js';
import { ChangePasswordDTO } from '../models/dtos/change-password.dto.js';
import { JwtService } from './jwt.service.js';
import { InvalidTokenException } from '../exceptions/invalid-token.exception.js';
import { InitiatePasswordResetDTO, ResetPasswordDTO } from '../models/dtos/reset-password.dto.js';


interface ResetTokenData {
    userId: string;
    expiresAt: number;
}

export class AuthService {
    private resetTokens: Map<string, ResetTokenData> = new Map();
    private readonly resetTokenExpiration = 3600000;

    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) {}

    async register(data: CreateUserDTO): Promise<void> {
        await this.userService.create(data);
    }

    async login(data: LoginDTO): Promise<string> {
        const user = await this.userService.findByUsername(data.username);
        if (!user) {
            throw new InvalidCredentialsException('Invalid username or password');
        }

        const hashedPassword = await this.userService.getPasswordByUsername(data.username);
        if (!hashedPassword) {
            throw new InvalidCredentialsException('Invalid username or password');
        }

        const isValidPassword = await HashService.verifyPassword(data.password, hashedPassword);
        if (!isValidPassword) {
            throw new InvalidCredentialsException('Invalid username or password');
        }

        return this.jwtService.generateToken(user.id, user.username);
    }

    async changePassword(token: string, data: ChangePasswordDTO): Promise<void> {
        const decodedToken = this.jwtService.verifyToken(token);
        const user = await this.userService.findById(decodedToken.userId);
        
        if (!user) {
            throw new InvalidTokenException('Invalid token: user not found');
        }

        const isValidPassword = await HashService.verifyPassword(data.oldPassword, user.password);
        if (!isValidPassword) {
            throw new InvalidCredentialsException('Current password is incorrect');
        }

        const hashedPassword = await HashService.hashPassword(data.newPassword);
        await this.userService.updatePassword(user.id, hashedPassword);
    }

    async initiatePasswordReset(data: InitiatePasswordResetDTO): Promise<string> {
        const user = await this.userService.findByEmail(data.email);
        const token = this.generateResetToken();

        if (user) {
            this.resetTokens.set(token, {
                userId: user.id,
                expiresAt: Date.now() + this.resetTokenExpiration
            });
        }

        return token;
    }

    async resetPassword(data: ResetPasswordDTO): Promise<void> {
        const tokenData = this.resetTokens.get(data.token);
        if (!tokenData) {
            throw new InvalidTokenException('Invalid or expired reset token');
        }

        if (Date.now() > tokenData.expiresAt) {
            this.resetTokens.delete(data.token);
            throw new InvalidTokenException('Reset token has expired');
        }

        const user = await this.userService.findById(tokenData.userId);
        if (!user) {
            this.resetTokens.delete(data.token);
            throw new InvalidTokenException('Invalid token: user not found');
        }

        await this.userService.updatePassword(user.id, data.newPassword);
        this.resetTokens.delete(data.token);
    }

    private generateResetToken(): string {
        return Math.random().toString(36).substring(2, 15) + 
               Math.random().toString(36).substring(2, 15);
    }
} 
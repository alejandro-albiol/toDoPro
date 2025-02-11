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
} 
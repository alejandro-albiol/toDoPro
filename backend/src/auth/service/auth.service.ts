import { HashService } from '../../shared/services/hash.service.js';
import { CreateUserDTO } from '../../users/models/dtos/create-user.dto.js';
import { UserService } from '../../users/service/user.service.js';
import { InvalidCredentialsException } from '../exceptions/invalid-credentials.exception.js';
import { LoginDTO } from '../models/dtos/login.dto.js';
import { ChangePasswordDTO } from '../models/dtos/change-password.dto.js';
import { JwtService } from './jwt.service.js';
import { InvalidTokenException } from '../exceptions/invalid-token.exception.js';
import { UserCreationFailedException } from '../../users/exceptions/user-creation-failed.exception.js';
import { UsernameAlreadyExistsException } from '../../users/exceptions/username-already-exists.exception.js';
import { EmailAlreadyExistsException } from '../../users/exceptions/email-already-exists.exception.js';

interface ResetTokenData {
    userId: string;
    expiresAt: number;
}

export class AuthService {
    private resetTokens: Map<string, ResetTokenData> = new Map();
    private readonly resetTokenExpiration = 3600000;

    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    async register(data: CreateUserDTO): Promise<void> {
        try {
            await this.userService.create(data);
        } catch (error) {
            if (error instanceof UsernameAlreadyExistsException || error instanceof EmailAlreadyExistsException) {
                throw error;
            } else {
                throw new UserCreationFailedException('User creation failed');
            }
        }
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

        return this.jwtService.generateToken(user.id!, user.username!);
    }

    async changePassword(token: string, data: ChangePasswordDTO): Promise<void> {
        const decodedToken = this.jwtService.verifyToken(token);
        const password = await this.userService.getPasswordByUsername(decodedToken.username);
        
        if (!password) {
            throw new InvalidTokenException('Invalid token: user not found');
        }

        const isValidPassword = await HashService.verifyPassword(data.oldPassword, password);
        if (!isValidPassword) {
            throw new InvalidCredentialsException('Current password is incorrect');
        }

        const hashedPassword = await HashService.hashPassword(data.newPassword);
        await this.userService.updatePassword(decodedToken.userId, hashedPassword);
    }
}

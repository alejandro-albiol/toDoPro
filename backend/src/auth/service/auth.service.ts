import { HashService } from '../../shared/services/hash.service.js';
import { CreateUserDTO } from '../../users/models/dtos/create-user.dto.js';
import { UserService } from '../../users/service/user.service.js';
import { InvalidCredentialsException } from '../exceptions/invalid-credentials.exception.js';
import { LoginDTO } from '../models/dtos/login.dto.js';
import { ChangePasswordDTO } from '../models/dtos/change-password.dto.js';
import { JwtService } from './jwt.service.js';
import { UserNotFoundException } from '../../users/exceptions/user-not-found.exception.js';
import { InvalidTokenException } from '../exceptions/invalid-token.exception.js';

export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) {}

    async login(credentials: LoginDTO): Promise<string> {
        const user = await this.userService.findByUsername(credentials.username);
        
        if (!user || !await HashService.verifyPassword(credentials.password, user.password)) {
            throw new InvalidCredentialsException('Invalid credentials');
        }
        return this.jwtService.generateToken(user.id, user.username);
    }

    async changePassword(token: string, changePasswordDTO: ChangePasswordDTO): Promise<void> {
        let userId: string;
        try {
            userId = this.jwtService.verifyToken(token).userId;
        } catch (error) {
            throw new InvalidTokenException('Invalid token');
        }

        const user = await this.userService.findById(userId);
        if (!user) {
            throw new UserNotFoundException(userId);
        }

        const isValidPassword = await HashService.verifyPassword(
            changePasswordDTO.oldPassword, 
            user.password
        );
        
        if (!isValidPassword) {
            throw new InvalidCredentialsException('Invalid credentials');
        }

        await this.userService.updatePassword(userId, changePasswordDTO.newPassword);
    }
} 
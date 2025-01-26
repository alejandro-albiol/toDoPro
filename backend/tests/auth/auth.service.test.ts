import { JwtService } from "../../src/auth/service/jwt.service.js";
import { AuthService } from "../../src/auth/service/auth.service.js";
import { UserService } from "../../src/users/service/user.service.js";
import { InvalidCredentialsException } from "../../src/auth/exceptions/invalid-credentials.exception.js";
import { InvalidTokenException } from "../../src/auth/exceptions/invalid-token.exception.js";
import { HashService } from "../../src/shared/services/hash-service.js";
import { mockUser } from "../__mocks__/user-mock.js";

describe('AuthService', () => {
    let authService: AuthService;
    let userService: jest.Mocked<UserService>;
    let jwtService: jest.Mocked<JwtService>;


    beforeEach(() => {
        userService = {
            findByUsername: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            updatePassword: jest.fn()
        } as any;

        jwtService = {
            generateToken: jest.fn(),
            verifyToken: jest.fn()
        } as any;

        authService = new AuthService(userService, jwtService);
    });

    describe('login', () => {
        it('should return token when credentials are valid', async () => {
            userService.findByUsername.mockResolvedValue(mockUser);
            jest.spyOn(HashService, 'verifyPassword').mockResolvedValue(true);
            jwtService.generateToken.mockReturnValue('valid.token');

            const result = await authService.login({
                username: 'testuser',
                password: 'correctPassword'
            });

            expect(result).toBe('valid.token');
        });

        it('should throw InvalidCredentialsException when user not found', async () => {
            userService.findByUsername.mockResolvedValue(null as any);

            await expect(authService.login({
                username: 'nonexistent',
                password: 'anypassword'
            })).rejects.toThrow(InvalidCredentialsException);
        });

        it('should throw InvalidCredentialsException when password is incorrect', async () => {
            userService.findByUsername.mockResolvedValue(mockUser);
            jest.spyOn(HashService, 'verifyPassword').mockResolvedValue(false);

            await expect(authService.login({
                username: 'testuser',
                password: 'wrongpassword'
            })).rejects.toThrow(InvalidCredentialsException);
        });
    });

    describe('changePassword', () => {
        it('should change password successfully', async () => {
            const validToken = 'valid.token';
            jwtService.verifyToken.mockReturnValue({ userId: '1', username: 'testuser' });
            userService.findById.mockResolvedValue(mockUser);
            jest.spyOn(HashService, 'verifyPassword').mockResolvedValue(true);

            await authService.changePassword(validToken, {
                oldPassword: 'currentPassword',
                newPassword: 'newPassword'
            });

            expect(userService.updatePassword).toHaveBeenCalledWith('1', 'newPassword');
        });

        it('should throw InvalidTokenException when token is invalid', async () => {
            jwtService.verifyToken.mockImplementation(() => {
                throw new Error();
            });

            await expect(authService.changePassword('invalid.token', {
                oldPassword: 'current',
                newPassword: 'new'
            })).rejects.toThrow(InvalidTokenException);
        });
    });
});
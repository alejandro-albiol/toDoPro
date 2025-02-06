import { AuthService } from '../../../../src/auth/service/auth.service.js';
import { UserService } from '../../../../src/users/service/user.service.js';
import { JwtService } from '../../../../src/auth/service/jwt.service.js';
import { HashService } from '../../../../src/shared/services/hash.service.js';
import { InvalidCredentialsException } from '../../../../src/auth/exceptions/invalid-credentials.exception.js';
import { InvalidTokenException } from '../../../../src/auth/exceptions/invalid-token.exception.js';
import { EmailAlreadyExistsException } from '../../../../src/users/exceptions/email-already-exists.exception.js';
import { UsernameAlreadyExistsException } from '../../../../src/users/exceptions/username-already-exists.exception.js';
import { UserCreationFailedException } from '../../../../src/users/exceptions/user-creation-failed.exception.js';

jest.mock('../../../../src/shared/services/hash.service.js');

describe('AuthService', () => {
    let service: AuthService;
    let mockUserService: jest.Mocked<UserService>;
    let mockJwtService: jest.Mocked<JwtService>;

    beforeEach(() => {
        mockUserService = {
            create: jest.fn(),
            findByUsername: jest.fn(),
            findByEmail: jest.fn(),
            findById: jest.fn(),
            updatePassword: jest.fn()
        } as any;

        mockJwtService = {
            generateToken: jest.fn(),
            verifyToken: jest.fn()
        } as any;

        service = new AuthService(mockUserService, mockJwtService);
    });

    describe('register', () => {
        const registerData = {
            username: 'testuser',
            email: 'test@example.com',
            password: 'Password123!'
        };

        it('should register user successfully', async () => {
            mockUserService.create.mockResolvedValueOnce({ id: '1', ...registerData });
            await service.register(registerData);
            expect(mockUserService.create).toHaveBeenCalledWith(registerData);
        });

        it('should propagate email already exists error', async () => {
            const error = new EmailAlreadyExistsException('test@example.com');
            mockUserService.create.mockRejectedValueOnce(error);
            await expect(service.register(registerData))
                .rejects
                .toThrow(error);
        });

        it('should propagate username already exists error', async () => {
            const error = new UsernameAlreadyExistsException('testuser');
            mockUserService.create.mockRejectedValueOnce(error);
            await expect(service.register(registerData))
                .rejects
                .toThrow(error);
        });

        it('should propagate user creation failed error', async () => {
            const error = new UserCreationFailedException('Failed to create user');
            mockUserService.create.mockRejectedValueOnce(error);
            await expect(service.register(registerData))
                .rejects
                .toThrow(error);
        });
    });

    describe('login', () => {
        const loginData = {
            username: 'testuser',
            password: 'Password123!'
        };

        const mockUser = {
            id: '1',
            username: 'testuser',
            email: 'test@example.com',
            password: 'hashedpassword'
        };

        beforeEach(() => {
            (HashService.verifyPassword as jest.Mock).mockResolvedValue(true);
        });

        it('should login successfully', async () => {
            mockUserService.findByUsername.mockResolvedValueOnce(mockUser);
            mockJwtService.generateToken.mockReturnValueOnce('jwt.token.here');

            const result = await service.login(loginData);

            expect(result).toBe('jwt.token.here');
            expect(mockUserService.findByUsername).toHaveBeenCalledWith(loginData.username);
            expect(HashService.verifyPassword).toHaveBeenCalledWith(loginData.password, mockUser.password);
            expect(mockJwtService.generateToken).toHaveBeenCalledWith(mockUser.id, mockUser.username);
        });

        it('should handle invalid username', async () => {
            mockUserService.findByUsername.mockResolvedValueOnce(null);

            await expect(service.login(loginData))
                .rejects
                .toThrow(InvalidCredentialsException);
        });

        it('should handle invalid password', async () => {
            mockUserService.findByUsername.mockResolvedValueOnce(mockUser);
            (HashService.verifyPassword as jest.Mock).mockResolvedValue(false);

            await expect(service.login(loginData))
                .rejects
                .toThrow(InvalidCredentialsException);
        });
    });

    describe('changePassword', () => {
        const changePasswordData = {
            oldPassword: 'OldPass123!',
            newPassword: 'NewPass123!'
        };

        const mockUser = {
            id: '1',
            username: 'testuser',
            email: 'test@example.com',
            password: 'hashedpassword'
        };

        const mockToken = {
            userId: '1',
            username: 'testuser'
        };

        beforeEach(() => {
            mockJwtService.verifyToken.mockReturnValueOnce(mockToken);
            (HashService.verifyPassword as jest.Mock).mockResolvedValue(true);
        });

        it('should change password successfully', async () => {
            mockUserService.findById.mockResolvedValueOnce(mockUser);

            await service.changePassword('valid.token', changePasswordData);

            expect(mockJwtService.verifyToken).toHaveBeenCalledWith('valid.token');
            expect(mockUserService.findById).toHaveBeenCalledWith(mockToken.userId);
            expect(HashService.verifyPassword).toHaveBeenCalledWith(changePasswordData.oldPassword, mockUser.password);
            expect(mockUserService.updatePassword).toHaveBeenCalledWith(mockToken.userId, changePasswordData.newPassword);
        });

        it('should handle invalid token', async () => {
            mockJwtService.verifyToken.mockImplementationOnce(() => {
                throw new InvalidTokenException('Invalid token');
            });

            await expect(service.changePassword('invalid.token', changePasswordData))
                .rejects
                .toThrow(InvalidTokenException);
        });

        it('should handle user not found', async () => {
            mockUserService.findById.mockResolvedValueOnce(null);

            await expect(service.changePassword('valid.token', changePasswordData))
                .rejects
                .toThrow(InvalidTokenException);
        });

        it('should handle invalid old password', async () => {
            mockUserService.findById.mockResolvedValueOnce(mockUser);
            (HashService.verifyPassword as jest.Mock).mockResolvedValue(false);

            await expect(service.changePassword('valid.token', changePasswordData))
                .rejects
                .toThrow(InvalidCredentialsException);
        });
    });
}); 
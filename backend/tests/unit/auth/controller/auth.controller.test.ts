import { Request, Response } from 'express';
import { AuthController } from '../../../../src/auth/controller/auth.controller.js';
import { AuthService } from '../../../../src/auth/service/auth.service.js';
import { InvalidTokenException } from '../../../../src/auth/exceptions/invalid-token.exception.js';
import { InvalidCredentialsException } from '../../../../src/auth/exceptions/invalid-credentials.exception.js';
import { EmailAlreadyExistsException } from '../../../../src/users/exceptions/email-already-exists.exception.js';
import { UsernameAlreadyExistsException } from '../../../../src/users/exceptions/username-already-exists.exception.js';
import { UserCreationFailedException } from '../../../../src/users/exceptions/user-creation-failed.exception.js';

jest.mock('../../../../src/shared/services/email.service.js');

describe('AuthController', () => {
    let controller: AuthController;
    let mockAuthService: jest.Mocked<AuthService>;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let jsonSpy: jest.Mock;
    let statusSpy: jest.Mock;

    beforeEach(() => {
        jsonSpy = jest.fn();
        statusSpy = jest.fn().mockReturnThis();
        mockResponse = {
            json: jsonSpy,
            status: statusSpy
        };

        mockAuthService = {
            register: jest.fn(),
            login: jest.fn(),
            changePassword: jest.fn()
        } as any;

        controller = new AuthController(mockAuthService);
    });

    describe('register', () => {
        const registerData = {
            username: 'testuser',
            email: 'test@example.com',
            password: 'Password123!'
        };

        beforeEach(() => {
            mockRequest = {
                body: registerData
            };
        });

        it('should register user successfully', async () => {
            mockAuthService.register.mockResolvedValueOnce();

            await controller.register(mockRequest as Request, mockResponse as Response);

            expect(mockAuthService.register).toHaveBeenCalledWith(registerData);
            expect(statusSpy).toHaveBeenCalledWith(201);
            expect(jsonSpy).toHaveBeenCalledWith({
                success: true,
                data: { message: 'User registered successfully' }
            });
        });

        it('should handle email already exists error', async () => {
            const error = new EmailAlreadyExistsException('test@example.com');
            mockAuthService.register.mockRejectedValueOnce(error);

            await controller.register(mockRequest as Request, mockResponse as Response);

            expect(statusSpy).toHaveBeenCalledWith(400);
            expect(jsonSpy).toHaveBeenCalledWith({
                success: false,
                error: {
                    code: error.errorCode,
                    message: error.message,
                    metadata: process.env.NODE_ENV === 'development' ? {
                        stack: error.stack
                    } : undefined
                }
            });
        });

        it('should handle username already exists error', async () => {
            const error = new UsernameAlreadyExistsException('testuser');
            mockAuthService.register.mockRejectedValueOnce(error);

            await controller.register(mockRequest as Request, mockResponse as Response);

            expect(statusSpy).toHaveBeenCalledWith(400);
            expect(jsonSpy).toHaveBeenCalledWith({
                success: false,
                error: {
                    code: error.errorCode,
                    message: error.message,
                    metadata: process.env.NODE_ENV === 'development' ? {
                        stack: error.stack
                    } : undefined
                }
            });
        });

        it('should handle user creation failed error', async () => {
            const error = new UserCreationFailedException('Failed to create user');
            mockAuthService.register.mockRejectedValueOnce(error);

            await controller.register(mockRequest as Request, mockResponse as Response);

            expect(statusSpy).toHaveBeenCalledWith(400);
            expect(jsonSpy).toHaveBeenCalledWith({
                success: false,
                error: {
                    code: error.errorCode,
                    message: error.message,
                    metadata: process.env.NODE_ENV === 'development' ? {
                        stack: error.stack
                    } : undefined
                }
            });
        });
    });

    describe('login', () => {
        const loginData = {
            username: 'testuser',
            password: 'Password123!'
        };

        beforeEach(() => {
            mockRequest = {
                body: loginData
            };
        });

        it('should login successfully', async () => {
            const token = 'jwt.token.here';
            mockAuthService.login.mockResolvedValueOnce(token);

            await controller.login(mockRequest as Request, mockResponse as Response);

            expect(mockAuthService.login).toHaveBeenCalledWith(loginData);
            expect(statusSpy).toHaveBeenCalledWith(200);
            expect(jsonSpy).toHaveBeenCalledWith({
                success: true,
                data: { token }
            });
        });

        it('should handle auth exception', async () => {
            const error = new InvalidCredentialsException('Invalid credentials');
            mockAuthService.login.mockRejectedValueOnce(error);

            await controller.login(mockRequest as Request, mockResponse as Response);

            expect(statusSpy).toHaveBeenCalledWith(401);
            expect(jsonSpy).toHaveBeenCalledWith({
                success: false,
                error: {
                    code: error.errorCode,
                    message: error.message,
                    metadata: process.env.NODE_ENV === 'development' ? {
                        stack: error.stack
                    } : undefined
                }
            });
        });
    });

    describe('changePassword', () => {
        const changePasswordData = {
            oldPassword: 'OldPass123!',
            newPassword: 'NewPass123!'
        };

        beforeEach(() => {
            mockRequest = {
                body: changePasswordData,
                headers: {
                    authorization: 'Bearer token.here'
                }
            };
        });

        it('should change password successfully', async () => {
            mockAuthService.changePassword.mockResolvedValueOnce();

            await controller.changePassword(mockRequest as Request, mockResponse as Response);

            expect(mockAuthService.changePassword).toHaveBeenCalledWith('token.here', changePasswordData);
            expect(statusSpy).toHaveBeenCalledWith(200);
            expect(jsonSpy).toHaveBeenCalledWith({
                success: true,
                data: { message: 'Password changed successfully' }
            });
        });

        it('should handle missing token', async () => {
            mockRequest.headers = {};
            const error = new InvalidTokenException('No token provided');

            await controller.changePassword(mockRequest as Request, mockResponse as Response);

            expect(statusSpy).toHaveBeenCalledWith(401);
            expect(jsonSpy).toHaveBeenCalledWith({
                success: false,
                error: {
                    code: error.errorCode,
                    message: error.message,
                    metadata: process.env.NODE_ENV === 'development' ? {
                        stack: error.stack
                    } : undefined
                }
            });
        });
    });
}); 
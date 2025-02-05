import { Request, Response } from 'express';
import { UserController } from '../../../../src/users/controller/user.controller.js';
import { IUserService } from '../../../../src/users/service/i-user.service.js';
import { UserException } from '../../../../src/users/exceptions/base-user.exception.js';
import { UserNotFoundException } from '../../../../src/users/exceptions/user-not-found.exception.js';
import { CreateUserDTO } from '../../../../src/users/models/dtos/create-user.dto.js';
import { UpdateUserDTO } from '../../../../src/users/models/dtos/update-user.dto.js';
import { User } from '../../../../src/users/models/entities/user.entity.js';
import { UserErrorCodes } from '../../../../src/users/exceptions/enums/user-error-codes.enum.js';

describe('UserController', () => {
    let controller: UserController;
    let mockUserService: jest.Mocked<IUserService>;
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

        mockUserService = {
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            updatePassword: jest.fn(),
            delete: jest.fn()
        } as any;

        controller = new UserController(mockUserService);
    });

    describe('create', () => {
        const createDto: CreateUserDTO = {
            username: 'testuser',
            email: 'test@example.com',
            password: 'Password123!'
        };

        const createdUser = {
            id: '1',
            username: 'testuser',
            email: 'test@example.com'
        };

        beforeEach(() => {
            mockRequest = {
                body: createDto
            };
        });

        it('should create user successfully', async () => {
            mockUserService.create.mockResolvedValueOnce(createdUser);

            await controller.create(mockRequest as Request, mockResponse as Response);

            expect(mockUserService.create).toHaveBeenCalledWith(createDto);
            expect(statusSpy).toHaveBeenCalledWith(201);
            expect(jsonSpy).toHaveBeenCalledWith({
                success: true,
                data: createdUser
            });
        });

        it('should handle user exception', async () => {
            const error = new UserNotFoundException('1');
            mockUserService.create.mockRejectedValueOnce(error);

            await controller.create(mockRequest as Request, mockResponse as Response);

            expect(statusSpy).toHaveBeenCalledWith(404);
            expect(jsonSpy).toHaveBeenCalledWith({
                success: false,
                error: {
                    code: UserErrorCodes.USER_NOT_FOUND,
                    message: error.message,
                    metadata: error.stack
                }
            });
        });

        it('should handle unknown error', async () => {
            const error = new Error('Unknown error');
            mockUserService.create.mockRejectedValueOnce(error);

            await controller.create(mockRequest as Request, mockResponse as Response);

            expect(statusSpy).toHaveBeenCalledWith(500);
            expect(jsonSpy).toHaveBeenCalledWith({
                success: false,
                error: {
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'An unexpected error occurred',
                    metadata: { detail: 'Unknown error' }
                }
            });
        });
    });

    describe('findAll', () => {
        const mockUsers = [
            { id: '1', username: 'user1', email: 'user1@example.com', password: 'hash1' },
            { id: '2', username: 'user2', email: 'user2@example.com', password: 'hash2' }
        ];

        it('should return all users successfully', async () => {
            mockUserService.findAll.mockResolvedValueOnce(mockUsers);

            await controller.findAll(mockRequest as Request, mockResponse as Response);

            expect(mockUserService.findAll).toHaveBeenCalled();
            expect(statusSpy).toHaveBeenCalledWith(200);
            expect(jsonSpy).toHaveBeenCalledWith({
                success: true,
                data: mockUsers
            });
        });

        it('should handle error', async () => {
            const error = new Error('Database error');
            mockUserService.findAll.mockRejectedValueOnce(error);

            await controller.findAll(mockRequest as Request, mockResponse as Response);

            expect(statusSpy).toHaveBeenCalledWith(500);
            expect(jsonSpy).toHaveBeenCalledWith({
                success: false,
                error: {
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'An unexpected error occurred',
                    metadata: { detail: 'Database error' }
                }
            });
        });
    });

    describe('findById', () => {
        const mockUser = { 
            id: '1', 
            username: 'user1', 
            email: 'user1@example.com',
            password: 'hashedpassword'
        };

        beforeEach(() => {
            mockRequest = {
                params: { id: '1' }
            };
        });

        it('should find user by id successfully', async () => {
            mockUserService.findById.mockResolvedValueOnce(mockUser);

            await controller.findById(mockRequest as Request, mockResponse as Response);

            expect(mockUserService.findById).toHaveBeenCalledWith('1');
            expect(statusSpy).toHaveBeenCalledWith(200);
            expect(jsonSpy).toHaveBeenCalledWith({
                success: true,
                data: mockUser
            });
        });

        it('should return not found when user does not exist', async () => {
            mockUserService.findById.mockResolvedValueOnce(null);

            await controller.findById(mockRequest as Request, mockResponse as Response);

            expect(statusSpy).toHaveBeenCalledWith(404);
            expect(jsonSpy).toHaveBeenCalledWith({
                success: false,
                error: {
                    code: UserErrorCodes.USER_NOT_FOUND,
                    message: `User with id ${mockRequest.params?.id} not found`
                }
            });
        });

        it('should handle error', async () => {
            const error = new Error('Database error');
            mockUserService.findById.mockRejectedValueOnce(error);

            await controller.findById(mockRequest as Request, mockResponse as Response);

            expect(statusSpy).toHaveBeenCalledWith(500);
            expect(jsonSpy).toHaveBeenCalledWith({
                success: false,
                error: {
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'An unexpected error occurred',
                    metadata: { detail: 'Database error' }
                }
            });
        });
    });

    describe('update', () => {
        const updateDto: UpdateUserDTO = {
            id: '1',
            username: 'updateduser',
            email: 'updated@example.com'
        };

        beforeEach(() => {
            mockRequest = {
                params: { id: '1' },
                body: {
                    username: 'updateduser',
                    email: 'updated@example.com'
                }
            };
        });

        it('should update user successfully', async () => {
            mockUserService.update.mockResolvedValueOnce(updateDto);

            await controller.update(mockRequest as Request, mockResponse as Response);

            expect(mockUserService.update).toHaveBeenCalledWith(updateDto);
            expect(statusSpy).toHaveBeenCalledWith(200);
            expect(jsonSpy).toHaveBeenCalledWith({
                success: true,
                data: updateDto
            });
        });

        it('should handle user not found error', async () => {
            const error = new UserNotFoundException('1');
            mockUserService.update.mockRejectedValueOnce(error);

            await controller.update(mockRequest as Request, mockResponse as Response);

            expect(statusSpy).toHaveBeenCalledWith(404);
            expect(jsonSpy).toHaveBeenCalledWith({
                success: false,
                error: {
                    code: UserErrorCodes.USER_NOT_FOUND,
                    message: error.message,
                    metadata: error.stack
                }
            });
        });
    });

    describe('updatePassword', () => {
        beforeEach(() => {
            mockRequest = {
                params: { id: '1' },
                body: { password: 'newPassword123!' }
            };
        });

        it('should update password successfully', async () => {
            mockUserService.updatePassword.mockResolvedValueOnce();

            await controller.updatePassword(mockRequest as Request, mockResponse as Response);

            expect(mockUserService.updatePassword).toHaveBeenCalledWith('1', 'newPassword123!');
            expect(statusSpy).toHaveBeenCalledWith(200);
            expect(jsonSpy).toHaveBeenCalledWith({
                success: true,
                data: { message: 'Password updated successfully' }
            });
        });

        it('should handle error', async () => {
            const error = new UserNotFoundException('1');
            mockUserService.updatePassword.mockRejectedValueOnce(error);

            await controller.updatePassword(mockRequest as Request, mockResponse as Response);

            expect(statusSpy).toHaveBeenCalledWith(404);
            expect(jsonSpy).toHaveBeenCalledWith({
                success: false,
                error: {
                    code: UserErrorCodes.USER_NOT_FOUND,
                    message: error.message,
                    metadata: error.stack
                }
            });
        });
    });

    describe('delete', () => {
        beforeEach(() => {
            mockRequest = {
                params: { id: '1' }
            };
        });

        it('should delete user successfully', async () => {
            mockUserService.delete.mockResolvedValueOnce(true);

            await controller.delete(mockRequest as Request, mockResponse as Response);

            expect(mockUserService.delete).toHaveBeenCalledWith('1');
            expect(statusSpy).toHaveBeenCalledWith(200);
            expect(jsonSpy).toHaveBeenCalledWith({
                success: true,
                data: { message: 'User deleted successfully' }
            });
        });

        it('should handle user not found', async () => {
            mockUserService.delete.mockResolvedValueOnce(false);

            await controller.delete(mockRequest as Request, mockResponse as Response);

            expect(statusSpy).toHaveBeenCalledWith(404);
            expect(jsonSpy).toHaveBeenCalledWith({
                success: false,
                error: {
                    code: UserErrorCodes.USER_NOT_FOUND,
                    message: `User with id ${mockRequest.params?.id} not found`
                }
            });
        });

        it('should handle error', async () => {
            const error = new Error('Database error');
            mockUserService.delete.mockRejectedValueOnce(error);

            await controller.delete(mockRequest as Request, mockResponse as Response);

            expect(statusSpy).toHaveBeenCalledWith(500);
            expect(jsonSpy).toHaveBeenCalledWith({
                success: false,
                error: {
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'An unexpected error occurred',
                    metadata: { detail: 'Database error' }
                }
            });
        });
    });
}); 
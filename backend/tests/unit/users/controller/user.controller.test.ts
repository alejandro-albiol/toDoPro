import { UserController } from '../../../../src/users/controller/user.controller.js';
import { IUserService } from '../../../../src/users/service/i-user.service.js';
import { CreateUserDTO } from '../../../../src/users/models/dtos/create-user.dto.js';
import { User } from '../../../../src/users/models/entities/user.entity.js';
import { EmailAlreadyExistsException } from '../../../../src/users/exceptions/email-already-exists.exception.js';
import { UsernameAlreadyExistsException } from '../../../../src/users/exceptions/username-already-exists.exception.js';
import { UserCreationFailedException } from '../../../../src/users/exceptions/user-creation-failed.exception.js';

describe('UserController', () => {
    let controller: UserController;
    let mockUserService: jest.Mocked<IUserService>;
    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(() => {
        mockUserService = {
            create: jest.fn()
        } as any;
        controller = new UserController(mockUserService);
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
    });

    describe('create', () => {
        const mockCreateUserDTO: CreateUserDTO = {
            username: 'TestUser',
            email: 'TEST@example.com',
            password: 'password123'
        };

        const mockCreatedUser: User = {
            id: '123',
            username: 'testuser',
            email: 'test@example.com',
            password: 'hashedpassword'
        };

        it('should create a user and return sanitized response', async () => {
            mockUserService.create.mockResolvedValueOnce(mockCreatedUser);

            const result = await controller.create(mockCreateUserDTO);
            expect(result.password).toBeUndefined();
            expect(result).toEqual(expect.objectContaining({
                id: mockCreatedUser.id,
                username: mockCreatedUser.username,
                email: mockCreatedUser.email
            }));


            expect(mockUserService.create).toHaveBeenCalledWith({
                username: mockCreateUserDTO.username.toLowerCase(),
                email: mockCreateUserDTO.email.toLowerCase(),
                password: mockCreateUserDTO.password
            });

        });

        it('should handle EmailAlreadyExistsException', async () => {
            mockUserService.create.mockRejectedValueOnce(
                new EmailAlreadyExistsException(mockCreateUserDTO.email)
            );

            await expect(controller.create(mockCreateUserDTO))
                .rejects
                .toThrow(EmailAlreadyExistsException);
        });

        it('should handle UsernameAlreadyExistsException', async () => {
            mockUserService.create.mockRejectedValueOnce(
                new UsernameAlreadyExistsException(mockCreateUserDTO.username)
            );

            await expect(controller.create(mockCreateUserDTO))
                .rejects
                .toThrow(UsernameAlreadyExistsException);
        });

        it('should handle unknown errors', async () => {
            const error = new Error('Unknown error');
            mockUserService.create.mockRejectedValueOnce(error);

            await expect(controller.create(mockCreateUserDTO))
                .rejects
                .toThrow(UserCreationFailedException);

            // Verify error is logged
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                'Unexpected error during user creation:',
                error
            );
        });
    });
});

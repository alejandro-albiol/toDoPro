import { UserService } from "../../src/users/service/user-service.js";
import { DataBaseErrorCode } from "../../src/shared/exceptions/enums/data-base-error-code.enum.js";
import { DataBaseException } from "../../src/shared/exceptions/data-base.exception.js";
import { UserNotFoundException } from "../../src/users/exceptions/user-not-found.exception.js";
import { InvalidUserDataException } from "../../src/users/exceptions/invalid-user-data.exception.js";
import { EmailAlreadyExistsException } from "../../src/users/exceptions/email-already-exists.exception.js";
import { UsernameAlreadyExistsException } from "../../src/users/exceptions/username-already-exists.exception.js";
import { UserCreationFailedException } from "../../src/users/exceptions/user-creation-failed.exception.js";
import { IUserService } from "../../src/users/service/i-user-service.js";

describe('UserService', () => {
    let userService: IUserService;
    let mockUserRepository: any;

    const mockUser = {
        id: '1',
        username: 'testuser',
        email: 'test@test.com',
        password: 'hashedPassword123',
        created_at: new Date(),
        updated_at: new Date()
    };

    beforeEach(() => {
        mockUserRepository = {
            create: jest.fn(),
            findById: jest.fn(),
            findByEmail: jest.fn(),
            findByUsername: jest.fn(),
            update: jest.fn(),
            updatePassword: jest.fn()
        };
        userService = new UserService(mockUserRepository);
    });

    describe('create', () => {
        it('should create user successfully', async () => {
            mockUserRepository.create.mockResolvedValue(mockUser);

            const result = await userService.create({
                username: 'testuser',
                email: 'test@test.com',
                password: 'password123'
            });

            expect(result).toEqual(mockUser);
        });

        it('should throw EmailAlreadyExistsException when email exists', async () => {
            mockUserRepository.create.mockRejectedValue(
                new DataBaseException('Duplicate email', DataBaseErrorCode.UNIQUE_VIOLATION)
            );

            await expect(userService.create({
                username: 'testuser',
                email: 'existing@test.com',
                password: 'password123'
            })).rejects.toThrow(EmailAlreadyExistsException);
        });

        it('should throw UsernameAlreadyExistsException when username exists', async () => {
            mockUserRepository.create.mockRejectedValue(
                new DataBaseException('Duplicate username', DataBaseErrorCode.UNIQUE_VIOLATION)
            );

            await expect(userService.create({
                username: 'existinguser',
                email: 'test@test.com',
                password: 'password123'
            })).rejects.toThrow(UsernameAlreadyExistsException);
        });

        it('should throw InvalidUserDataException when data is invalid', async () => {
            mockUserRepository.create.mockRejectedValue(
                new DataBaseException('Invalid data', DataBaseErrorCode.INVALID_INPUT)
            );

            await expect(userService.create({
                username: '',
                email: 'invalid-email',
                password: '123'
            })).rejects.toThrow(InvalidUserDataException);
        });

        it('should throw UserCreationFailedException when repository returns null', async () => {
            mockUserRepository.create.mockResolvedValue(null);

            await expect(userService.create({
                username: 'testuser',
                email: 'test@test.com',
                password: 'password123'
            })).rejects.toThrow(UserCreationFailedException);
        });
    });

    describe('findById', () => {
        it('should find user by id', async () => {
            mockUserRepository.findById.mockResolvedValue(mockUser);

            const result = await userService.findById('1');

            expect(result).toEqual(mockUser);
        });

        it('should throw UserNotFoundException when user not found', async () => {
            mockUserRepository.findById.mockResolvedValue(null);

            await expect(userService.findById('999'))
                .rejects.toThrow(UserNotFoundException);
        });

        it('should throw InvalidUserDataException when id format is invalid', async () => {
            mockUserRepository.findById.mockRejectedValue(
                new DataBaseException('Invalid id', DataBaseErrorCode.INVALID_INPUT)
            );

            await expect(userService.findById('invalid-id'))
                .rejects.toThrow(InvalidUserDataException);
        });
    });

    describe('findByEmail', () => {
        it('should find user by email', async () => {
            mockUserRepository.findByEmail.mockResolvedValue(mockUser);

            const result = await userService.findByEmail('test@test.com');

            expect(result).toEqual(mockUser);
        });

        it('should throw UserNotFoundException when email not found', async () => {
            mockUserRepository.findByEmail.mockResolvedValue(null);

            await expect(userService.findByEmail('notfound@test.com'))
                .rejects.toThrow(UserNotFoundException);
        });
    });

    describe('updatePassword', () => {
        it('should update password successfully', async () => {
            mockUserRepository.updatePassword.mockResolvedValue(undefined);

            await expect(userService.updatePassword('1', 'newPassword123'))
                .resolves.not.toThrow();
        });

        it('should throw UserNotFoundException when user not found', async () => {
            mockUserRepository.updatePassword.mockRejectedValue(
                new DataBaseException('User not found', DataBaseErrorCode.NOT_FOUND)
            );

            await expect(userService.updatePassword('999', 'newPassword123'))
                .rejects.toThrow(UserNotFoundException);
        });

        it('should throw InvalidUserDataException when password format is invalid', async () => {
            mockUserRepository.updatePassword.mockRejectedValue(
                new DataBaseException('Invalid password', DataBaseErrorCode.INVALID_INPUT)
            );

            await expect(userService.updatePassword('1', '123'))
                .rejects.toThrow(InvalidUserDataException);
        });
    });
}); 
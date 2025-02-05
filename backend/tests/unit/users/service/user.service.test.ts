import { UserService } from '../../../../src/users/service/user.service.js';
import { IUserRepository } from '../../../../src/users/repository/i-user.repository.js';
import { User } from '../../../../src/users/models/entities/user.entity.js';
import { CreateUserDTO } from '../../../../src/users/models/dtos/create-user.dto.js';
import { UpdateUserDTO } from '../../../../src/users/models/dtos/update-user.dto.js';
import { UserNotFoundException } from '../../../../src/users/exceptions/user-not-found.exception.js';
import { EmailAlreadyExistsException } from '../../../../src/users/exceptions/email-already-exists.exception.js';
import { UsernameAlreadyExistsException } from '../../../../src/users/exceptions/username-already-exists.exception.js';
import { UserCreationFailedException } from '../../../../src/users/exceptions/user-creation-failed.exception.js';
import { InvalidUserDataException } from '../../../../src/users/exceptions/invalid-user-data.exception.js';
import { DbErrorCode } from '../../../../src/shared/models/constants/db-error-code.enum.js';
import { HashService } from '../../../../src/shared/services/hash.service.js';

jest.mock('../../../../src/shared/services/hash.service.js');

describe('UserService', () => {
    let service: UserService;
    let mockRepository: jest.Mocked<IUserRepository>;

    beforeEach(() => {
        mockRepository = {
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            findByEmail: jest.fn(),
            findByUsername: jest.fn(),
            updatePassword: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
        } as any;

        service = new UserService(mockRepository);
        (HashService.hashPassword as jest.Mock).mockResolvedValue('hashedpassword');
    });

    describe('create', () => {
        const createDto: CreateUserDTO = {
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123'
        };

        it('should create a user successfully', async () => {
            const expectedUser = {
                id: '1',
                username: createDto.username,
                email: createDto.email
            };

            mockRepository.create.mockResolvedValueOnce(expectedUser);

            const result = await service.create(createDto);

            expect(result).toEqual(expectedUser);
            expect(HashService.hashPassword).toHaveBeenCalledWith(createDto.password);
            expect(mockRepository.create).toHaveBeenCalledWith({
                ...createDto,
                password: 'hashedpassword'
            });
        });

        it('should handle email already exists error with full metadata', async () => {
            mockRepository.create.mockRejectedValueOnce({
                code: DbErrorCode.UNIQUE_VIOLATION,
                message: 'Unique violation',
                metadata: {
                    column: 'email',
                    detail: 'Key (email)=(test@example.com) already exists',
                    constraint: 'users_email_key',
                    table: 'users'
                }
            });

            await expect(service.create(createDto))
                .rejects
                .toThrow(EmailAlreadyExistsException);
        });

        it('should handle username already exists error with partial metadata', async () => {
            mockRepository.create.mockRejectedValueOnce({
                code: DbErrorCode.UNIQUE_VIOLATION,
                message: 'Unique violation',
                metadata: {
                    column: 'username',
                    detail: 'Key (username)=(testuser) already exists'
                }
            });

            await expect(service.create(createDto))
                .rejects
                .toThrow(UsernameAlreadyExistsException);
        });

        it('should handle password hashing failure', async () => {
            (HashService.hashPassword as jest.Mock).mockRejectedValueOnce(new Error('Hashing failed'));

            await expect(service.create(createDto))
                .rejects
                .toThrow(UserCreationFailedException);
        });

        it('should handle database not found error', async () => {
            mockRepository.create.mockRejectedValueOnce({
                code: DbErrorCode.NOT_FOUND,
                message: 'Resource not found',
                metadata: { id: '1' }
            });

            await expect(service.create(createDto))
                .rejects
                .toThrow(UserNotFoundException);
        });

        it('should handle unknown database error', async () => {
            mockRepository.create.mockRejectedValueOnce({
                code: 'XX000',
                message: 'Unknown database error'
            });

            await expect(service.create(createDto))
                .rejects
                .toThrow(InvalidUserDataException);
        });
    });

    describe('findAll', () => {
        it('should return all users without passwords', async () => {
            const mockUsers = [
                { id: '1', username: 'user1', email: 'user1@example.com', password: 'hash1' },
                { id: '2', username: 'user2', email: 'user2@example.com', password: 'hash2' }
            ];

            const expectedUsers = mockUsers.map(({ password, ...user }) => user);

            mockRepository.findAll.mockResolvedValueOnce(mockUsers);

            const result = await service.findAll();

            expect(result).toEqual(expectedUsers);
        });

        it('should handle database error with code', async () => {
            mockRepository.findAll.mockRejectedValueOnce({
                code: DbErrorCode.NOT_FOUND,
                message: 'Table not found'
            });

            await expect(service.findAll())
                .rejects
                .toThrow(UserNotFoundException);
        });

        it('should handle unknown error', async () => {
            mockRepository.findAll.mockRejectedValueOnce(new Error('Unknown error'));

            await expect(service.findAll())
                .rejects
                .toThrow(InvalidUserDataException);
        });
    });

    describe('findById', () => {
        const mockUser: User = {
            id: '1',
            username: 'testuser',
            email: 'test@example.com',
            password: 'hashedpassword'
        };

        it('should find user by id without password', async () => {
            const { password, ...expectedUser } = mockUser;

            mockRepository.findById.mockResolvedValueOnce(mockUser);

            const result = await service.findById('1');

            expect(result).toEqual(expectedUser);
        });

        it('should return null when user not found', async () => {
            mockRepository.findById.mockResolvedValueOnce(null);

            const result = await service.findById('1');

            expect(result).toBeNull();
        });

        it('should handle database errors', async () => {
            mockRepository.findById.mockRejectedValueOnce(new Error('Database error'));

            await expect(service.findById('1'))
                .rejects
                .toThrow(InvalidUserDataException);
        });

        it('should handle database errors with code', async () => {
            mockRepository.findById.mockRejectedValueOnce({
                code: DbErrorCode.FOREIGN_KEY_VIOLATION,
                message: 'Foreign key violation'
            });

            await expect(service.findById('1'))
                .rejects
                .toThrow(InvalidUserDataException);
        });

        it('should handle UserNotFoundException and return null', async () => {
            mockRepository.findById.mockRejectedValueOnce(new UserNotFoundException('1'));

            const result = await service.findById('1');
            expect(result).toBeNull();
        });
    });

    describe('updatePassword', () => {
        const mockUser: User = {
            id: '1',
            username: 'testuser',
            email: 'test@example.com',
            password: 'oldhash'
        };

        it('should update password successfully', async () => {
            mockRepository.findById.mockResolvedValueOnce(mockUser);
            mockRepository.updatePassword.mockResolvedValueOnce(undefined);

            await service.updatePassword('1', 'newpassword');

            expect(HashService.hashPassword).toHaveBeenCalledWith('newpassword');
            expect(mockRepository.updatePassword).toHaveBeenCalledWith('1', 'hashedpassword');
        });

        it('should handle user not found during validation', async () => {
            mockRepository.findById.mockResolvedValueOnce(null);

            await expect(service.updatePassword('1', 'newpassword'))
                .rejects
                .toThrow(UserNotFoundException);
            
            expect(mockRepository.updatePassword).not.toHaveBeenCalled();
        });

        it('should handle password hashing failure', async () => {
            mockRepository.findById.mockResolvedValueOnce(mockUser);
            (HashService.hashPassword as jest.Mock).mockRejectedValueOnce(new Error('Hashing failed'));

            await expect(service.updatePassword('1', 'newpassword'))
                .rejects
                .toThrow(InvalidUserDataException);
            
            expect(mockRepository.updatePassword).not.toHaveBeenCalled();
        });

        it('should handle database error during update', async () => {
            mockRepository.findById.mockResolvedValueOnce(mockUser);
            mockRepository.updatePassword.mockRejectedValueOnce({
                code: DbErrorCode.FOREIGN_KEY_VIOLATION,
                message: 'Foreign key violation'
            });

            await expect(service.updatePassword('1', 'newpassword'))
                .rejects
                .toThrow(InvalidUserDataException);
        });
    });

    describe('update', () => {
        const updateDto: UpdateUserDTO = {
            id: '1',
            username: 'updateduser',
            email: 'updated@example.com'
        };

        const mockUser: User = {
            id: '1',
            username: 'olduser',
            email: 'old@example.com',
            password: 'hash'
        };

        it('should update user successfully', async () => {
            mockRepository.findById.mockResolvedValueOnce(mockUser);
            mockRepository.update.mockResolvedValueOnce(updateDto);

            const result = await service.update(updateDto);

            expect(result).toEqual(updateDto);
        });

        it('should handle user not found during validation', async () => {
            mockRepository.findById.mockResolvedValueOnce(null);

            await expect(service.update(updateDto))
                .rejects
                .toThrow(UserNotFoundException);
            
            expect(mockRepository.update).not.toHaveBeenCalled();
        });

        it('should handle unique constraint violation with full metadata', async () => {
            mockRepository.findById.mockResolvedValueOnce(mockUser);
            mockRepository.update.mockRejectedValueOnce({
                code: DbErrorCode.UNIQUE_VIOLATION,
                message: 'Unique violation',
                metadata: {
                    column: 'email',
                    detail: 'Key (email)=(updated@example.com) already exists',
                    constraint: 'users_email_key',
                    table: 'users'
                }
            });

            await expect(service.update(updateDto))
                .rejects
                .toThrow(EmailAlreadyExistsException);
        });

        it('should handle database error with unknown code', async () => {
            mockRepository.findById.mockResolvedValueOnce(mockUser);
            mockRepository.update.mockRejectedValueOnce({
                code: 'XX000',
                message: 'Unknown database error'
            });

            await expect(service.update(updateDto))
                .rejects
                .toThrow(InvalidUserDataException);
        });

        it('should handle non-database error', async () => {
            mockRepository.findById.mockResolvedValueOnce(mockUser);
            mockRepository.update.mockRejectedValueOnce(new Error('Unexpected error'));

            await expect(service.update(updateDto))
                .rejects
                .toThrow(InvalidUserDataException);
        });
    });

    describe('findByEmail', () => {
        const mockUser: User = {
            id: '1',
            username: 'testuser',
            email: 'test@example.com',
            password: 'hashedpassword'
        };

        it('should find user by email without password', async () => {
            const { password, ...expectedUser } = mockUser;
            mockRepository.findByEmail.mockResolvedValueOnce(mockUser);

            const result = await service.findByEmail('test@example.com');

            expect(result).toEqual(expectedUser);
        });

        it('should return null when user not found', async () => {
            mockRepository.findByEmail.mockResolvedValueOnce(null);

            const result = await service.findByEmail('nonexistent@example.com');

            expect(result).toBeNull();
        });

        it('should handle database errors', async () => {
            mockRepository.findByEmail.mockRejectedValueOnce({
                code: DbErrorCode.FOREIGN_KEY_VIOLATION,
                message: 'Database error'
            });

            await expect(service.findByEmail('test@example.com'))
                .rejects
                .toThrow(InvalidUserDataException);
        });

        it('should handle non-database errors', async () => {
            mockRepository.findByEmail.mockRejectedValueOnce(new Error('Network error'));

            await expect(service.findByEmail('test@example.com'))
                .rejects
                .toThrow(InvalidUserDataException);
        });
    });

    describe('findByUsername', () => {
        const mockUser: User = {
            id: '1',
            username: 'testuser',
            email: 'test@example.com',
            password: 'hashedpassword'
        };

        it('should find user by username without password', async () => {
            const { password, ...expectedUser } = mockUser;
            mockRepository.findByUsername.mockResolvedValueOnce(mockUser);

            const result = await service.findByUsername('testuser');

            expect(result).toEqual(expectedUser);
        });

        it('should return null when user not found', async () => {
            mockRepository.findByUsername.mockResolvedValueOnce(null);

            const result = await service.findByUsername('nonexistent');

            expect(result).toBeNull();
        });

        it('should handle database errors', async () => {
            mockRepository.findByUsername.mockRejectedValueOnce({
                code: DbErrorCode.FOREIGN_KEY_VIOLATION,
                message: 'Database error'
            });

            await expect(service.findByUsername('testuser'))
                .rejects
                .toThrow(InvalidUserDataException);
        });

        it('should handle non-database errors', async () => {
            mockRepository.findByUsername.mockRejectedValueOnce(new Error('Network error'));

            await expect(service.findByUsername('testuser'))
                .rejects
                .toThrow(InvalidUserDataException);
        });
    });

    describe('delete', () => {
        const mockUser: User = {
            id: '1',
            username: 'testuser',
            email: 'test@example.com',
            password: 'hashedpassword'
        };

        it('should delete user successfully', async () => {
            mockRepository.findById.mockResolvedValueOnce(mockUser);
            mockRepository.delete.mockResolvedValueOnce(true);

            const result = await service.delete('1');

            expect(result).toBe(true);
            expect(mockRepository.findById).toHaveBeenCalledWith('1');
            expect(mockRepository.delete).toHaveBeenCalledWith('1');
        });

        it('should handle user not found during validation', async () => {
            mockRepository.findById.mockResolvedValueOnce(null);

            await expect(service.delete('1'))
                .rejects
                .toThrow(UserNotFoundException);
            
            expect(mockRepository.delete).not.toHaveBeenCalled();
        });

        it('should handle database errors during validation', async () => {
            mockRepository.findById.mockRejectedValueOnce({
                code: DbErrorCode.FOREIGN_KEY_VIOLATION,
                message: 'Database error'
            });

            await expect(service.delete('1'))
                .rejects
                .toThrow(InvalidUserDataException);
        });

        it('should handle database errors during deletion', async () => {
            mockRepository.findById.mockResolvedValueOnce(mockUser);
            mockRepository.delete.mockRejectedValueOnce({
                code: DbErrorCode.FOREIGN_KEY_VIOLATION,
                message: 'Database error'
            });

            await expect(service.delete('1'))
                .rejects
                .toThrow(InvalidUserDataException);
        });

        it('should handle non-database errors', async () => {
            mockRepository.findById.mockResolvedValueOnce(mockUser);
            mockRepository.delete.mockRejectedValueOnce(new Error('Network error'));

            await expect(service.delete('1'))
                .rejects
                .toThrow(InvalidUserDataException);
        });
    });
});

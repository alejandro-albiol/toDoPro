import { UserRepository } from '../../../../src/users/repository/user.repository.js';
import { User } from '../../../../src/users/models/entities/user.entity.js';
import { IDatabasePool } from '../../../../src/shared/models/interfaces/base/i-database-pool.js';
import { DbErrorCode } from '../../../../src/shared/models/constants/db-error-code.enum.js';
import { DatabaseError } from 'pg';
import { UpdateUserDTO } from '../../../../src/users/models/dtos/update-user.dto.js';

describe('UserRepository', () => {
    let repository: UserRepository;
    let mockPool: jest.Mocked<IDatabasePool>;

    beforeEach(() => {
        mockPool = {
            query: jest.fn()
        } as any;
        repository = new UserRepository(mockPool);
    });

    const createDatabaseError = (code: string, detail: string, constraint?: string, table?: string, column?: string): DatabaseError => {
        const error = new DatabaseError(detail, 42, 'error');
        Object.assign(error, {
            code,
            detail,
            constraint,
            table,
            column
        });
        return error;
    };

    describe('create', () => {
        const mockUser: User = {
            id: '1',
            username: 'testuser',
            email: 'test@example.com',
            password: 'hashedpassword123'
        };

        it('should create a user successfully', async () => {
            const expectedUser = { ...mockUser };
            delete (expectedUser as any).password;

            mockPool.query.mockResolvedValueOnce({ 
                rows: [expectedUser],
                rowCount: 1
            });

            const result = await repository.create(mockUser);
            expect(result).toEqual(expectedUser);
            expect(mockPool.query).toHaveBeenCalledWith(
                expect.any(String),
                [mockUser.username, mockUser.email, mockUser.password]
            );
        });

        it('should handle unique constraint violation (email) with full metadata', async () => {
            const error = createDatabaseError(
                '23505',
                'Key (email)=(test@example.com) already exists',
                'users_email_key',
                'users',
                'email'
            );
            mockPool.query.mockRejectedValueOnce(error);

            await expect(repository.create(mockUser)).rejects.toMatchObject({
                code: DbErrorCode.UNIQUE_VIOLATION,
                metadata: {
                    column: 'email',
                detail: 'Key (email)=(test@example.com) already exists',
                constraint: 'users_email_key',
                    table: 'users'
                }
            });
        });

        it('should handle unique constraint violation (username) with partial metadata', async () => {
            const error = createDatabaseError(
                '23505',
                'Key (username)=(testuser) already exists',
                undefined,
                'users',
                'username'
            );
            mockPool.query.mockRejectedValueOnce(error);

            await expect(repository.create(mockUser)).rejects.toMatchObject({
                code: DbErrorCode.UNIQUE_VIOLATION,
                metadata: {
                    column: 'username',
                    detail: 'Key (username)=(testuser) already exists',
                    table: 'users'
                }
            });
        });

        it('should handle database error with minimal metadata', async () => {
            const error = new DatabaseError('Database connection failed', 42, 'error');
            error.code = '42P01';
            mockPool.query.mockRejectedValueOnce(error);

            await expect(repository.create(mockUser)).rejects.toMatchObject({
                code: '42P01',
                message: 'Database connection failed',
                metadata: {
                    detail: undefined,
                    constraint: undefined,
                    table: undefined,
                    column: undefined
                }
            });
        });

        it('should handle non-DatabaseError with code', async () => {
            const error = new Error('Custom error') as any;
            error.code = DbErrorCode.NOT_FOUND;
            mockPool.query.mockRejectedValueOnce(error);

            await expect(repository.create(mockUser)).rejects.toMatchObject({
                code: DbErrorCode.NOT_FOUND,
                message: 'Custom error'
            });
        });

        it('should handle unknown error types', async () => {
            mockPool.query.mockRejectedValueOnce('Unexpected string error');

            await expect(repository.create(mockUser)).rejects.toMatchObject({
                code: DbErrorCode.UNKNOWN_ERROR,
                message: 'An unexpected error occurred while creating user',
                metadata: { detail: 'Unknown error' }
            });
        });
    });

    describe('findAll', () => {
        const mockUsers = [
            { id: '1', username: 'user1', email: 'user1@example.com' },
            { id: '2', username: 'user2', email: 'user2@example.com' }
        ];

        it('should return all users', async () => {
            mockPool.query.mockResolvedValueOnce({
                rows: mockUsers,
                rowCount: 2
            });

            const result = await repository.findAll();
            expect(result).toEqual(mockUsers);
            expect(mockPool.query).toHaveBeenCalled();
        });

        it('should return empty array when no users exist', async () => {
            mockPool.query.mockResolvedValueOnce({
                rows: [],
                rowCount: 0
            });

            const result = await repository.findAll();
            expect(result).toEqual([]);
        });

        it('should handle database errors', async () => {
            mockPool.query.mockRejectedValueOnce(new Error('Database error'));

            await expect(repository.findAll()).rejects.toMatchObject({
                code: DbErrorCode.UNKNOWN_ERROR
            });
        });

        it('should handle database error with code but no metadata', async () => {
            const error = new DatabaseError('Table not found', 42, 'error');
            error.code = '42P01';
            mockPool.query.mockRejectedValueOnce(error);

            await expect(repository.findAll()).rejects.toMatchObject({
                code: '42P01',
                message: 'Table not found',
                metadata: {
                    detail: undefined,
                    constraint: undefined,
                    table: undefined,
                    column: undefined
                }
            });
        });
    });

    describe('findById', () => {
        const mockUser = { id: '1', username: 'user1', email: 'user1@example.com' };

        it('should find user by id', async () => {
            mockPool.query.mockResolvedValueOnce({
                rows: [mockUser],
                rowCount: 1
            });

            const result = await repository.findById('1');
            expect(result).toEqual(mockUser);
            expect(mockPool.query).toHaveBeenCalledWith(
                expect.any(String),
                ['1']
            );
        });

        it('should return null when user not found', async () => {
            mockPool.query.mockResolvedValueOnce({
                rows: [],
                rowCount: 0
            });

            const result = await repository.findById('1');
            expect(result).toBeNull();
        });

        it('should handle database errors with full metadata', async () => {
            const error = createDatabaseError(
                '42P01',
                'Table not found',
                'users_pkey',
                'users',
                'id'
            );
            mockPool.query.mockRejectedValueOnce(error);

            await expect(repository.findById('1')).rejects.toMatchObject({
                code: '42P01',
                message: 'Table not found',
                metadata: {
                    detail: 'Table not found',
                    constraint: 'users_pkey',
                    table: 'users',
                    column: 'id'
                }
            });
        });

        it('should handle non-database errors with custom message', async () => {
            const error = new Error('Connection timeout');
            mockPool.query.mockRejectedValueOnce(error);

            await expect(repository.findById('1')).rejects.toMatchObject({
                code: DbErrorCode.UNKNOWN_ERROR,
                message: 'An unexpected error occurred while finding user by id',
                metadata: { detail: 'Connection timeout' }
            });
        });

        it('should handle undefined error', async () => {
            mockPool.query.mockRejectedValueOnce(undefined);

            await expect(repository.findById('1')).rejects.toMatchObject({
                code: DbErrorCode.UNKNOWN_ERROR,
                message: 'An unexpected error occurred while finding user by id',
                metadata: { detail: 'Unknown error' }
            });
        });
    });

    describe('findByEmail', () => {
        const mockUser = { id: '1', username: 'user1', email: 'user1@example.com' };

        it('should find user by email', async () => {
            mockPool.query.mockResolvedValueOnce({
                rows: [mockUser],
                rowCount: 1
            });

            const result = await repository.findByEmail('user1@example.com');
            expect(result).toEqual(mockUser);
            expect(mockPool.query).toHaveBeenCalledWith(
                expect.any(String),
                ['user1@example.com']
            );
        });

        it('should return null when user not found', async () => {
            mockPool.query.mockResolvedValueOnce({
                rows: [],
                rowCount: 0
            });

            const result = await repository.findByEmail('nonexistent@example.com');
            expect(result).toBeNull();
        });

        it('should handle database error with full metadata', async () => {
            const error = createDatabaseError(
                '42P01',
                'Table not found',
                'users_email_key',
                'users',
                'email'
            );
            mockPool.query.mockRejectedValueOnce(error);

            await expect(repository.findByEmail('user1@example.com')).rejects.toMatchObject({
                code: '42P01',
                message: 'Table not found',
                metadata: {
                    detail: 'Table not found',
                    constraint: 'users_email_key',
                    table: 'users',
                    column: 'email'
                }
            });
        });

        it('should handle database error with minimal metadata', async () => {
            const minimalError = new DatabaseError('Minimal error', 0, 'error');
            minimalError.code = '23505';
            mockPool.query.mockRejectedValueOnce(minimalError);

            await expect(repository.findByEmail('user1@example.com')).rejects.toMatchObject({
                code: '23505',
                message: 'Minimal error',
                metadata: {
                    detail: undefined,
                    constraint: undefined,
                    table: undefined,
                    column: undefined
                }
            });
        });

        it('should handle database error with partial metadata', async () => {
            const partialError = new DatabaseError('Partial error', 0, 'error');
            partialError.code = '23505';
            partialError.table = 'users';
            partialError.column = 'email';
            mockPool.query.mockRejectedValueOnce(partialError);

            await expect(repository.findByEmail('user1@example.com')).rejects.toMatchObject({
                code: '23505',
                message: 'Partial error',
                metadata: {
                    table: 'users',
                    column: 'email'
                }
            });
        });

        it('should handle non-database errors', async () => {
            mockPool.query.mockRejectedValueOnce(new Error('Network error'));

            await expect(repository.findByEmail('user1@example.com')).rejects.toMatchObject({
                code: DbErrorCode.UNKNOWN_ERROR,
                message: 'An unexpected error occurred while finding user by email',
                metadata: { detail: 'Network error' }
            });
        });
    });

    describe('findByUsername', () => {
        const mockUser = { id: '1', username: 'user1', email: 'user1@example.com' };

        it('should find user by username', async () => {
            mockPool.query.mockResolvedValueOnce({
                rows: [mockUser],
                rowCount: 1
            });

            const result = await repository.findByUsername('user1');
            expect(result).toEqual(mockUser);   
            expect(mockPool.query).toHaveBeenCalledWith(
                expect.any(String),
                ['user1']
            );
        });

        it('should return null when user not found', async () => {
            mockPool.query.mockResolvedValueOnce({
                rows: [],
                rowCount: 0
            });

            const result = await repository.findByUsername('nonexistent');
            expect(result).toBeNull();
        });

        it('should handle database errors with full metadata', async () => {
            const error = createDatabaseError(
                '42P01',
                'Table not found',
                'users_username_key',
                'users',
                'username'
            );
            mockPool.query.mockRejectedValueOnce(error);

            await expect(repository.findByUsername('user1')).rejects.toMatchObject({
                code: '42P01',
                message: 'Table not found',
                metadata: {
                    detail: 'Table not found',
                    constraint: 'users_username_key',
                    table: 'users',
                    column: 'username'
                }
            });
        });

        it('should handle non-database errors', async () => {
            const error = new Error('Network error');
            mockPool.query.mockRejectedValueOnce(error);

            await expect(repository.findByUsername('user1')).rejects.toMatchObject({
                code: DbErrorCode.UNKNOWN_ERROR,
                message: 'An unexpected error occurred while finding user by username',
                metadata: { detail: 'Network error' }
            });
        });
    });

    describe('updatePassword', () => {
        it('should update password successfully', async () => {
            mockPool.query.mockResolvedValueOnce({
                rows: [],
                rowCount: 1
            });

            await repository.updatePassword('1', 'newhashedpassword');
            expect(mockPool.query).toHaveBeenCalledWith(
                expect.any(String),
                ['1', 'newhashedpassword']
            );
        });

        it('should handle not found with custom error message', async () => {
            mockPool.query.mockResolvedValueOnce({
                rows: [],
                rowCount: 0
            });

            await expect(repository.updatePassword('1', 'newpassword')).rejects.toMatchObject({
                code: DbErrorCode.NOT_FOUND,
                message: 'User not found',
                metadata: { detail: 'User with id 1 does not exist' }
            });
        });

        it('should handle database error with full metadata', async () => {
            const error = createDatabaseError(
                '23503',
                'Foreign key violation',
                'users_role_id_fkey',
                'users',
                'role_id'
            );
            mockPool.query.mockRejectedValueOnce(error);

            await expect(repository.updatePassword('1', 'newpassword')).rejects.toMatchObject({
                code: '23503',
                message: 'Foreign key violation',
                metadata: {
                    detail: 'Foreign key violation',
                    constraint: 'users_role_id_fkey',
                    table: 'users',
                    column: 'role_id'
                }
            });
        });

        it('should handle generic database error with code', async () => {
            const genericError = {
                code: DbErrorCode.FOREIGN_KEY_VIOLATION,
                message: 'Foreign key violation',
                metadata: { detail: 'Role does not exist' }
            };
            mockPool.query.mockRejectedValueOnce(genericError);

            await expect(repository.updatePassword('1', 'newpassword')).rejects.toEqual(genericError);
        });

        it('should handle non-database errors with custom message', async () => {
            const error = new Error('Network error');
            mockPool.query.mockRejectedValueOnce(error);

            await expect(repository.updatePassword('1', 'newpassword')).rejects.toMatchObject({
                code: DbErrorCode.UNKNOWN_ERROR,
                message: 'An unexpected error occurred while updating user password',
                metadata: { detail: 'Network error' }
            });
        });

        it('should handle database error with minimal metadata', async () => {
            const minimalError = new DatabaseError('Minimal error', 0, 'error');
            minimalError.code = '23505';
            mockPool.query.mockRejectedValueOnce(minimalError);

            await expect(repository.updatePassword('1', 'newpassword')).rejects.toMatchObject({
                code: '23505',
                message: 'Minimal error'
            });
        });

        it('should handle database error with partial metadata', async () => {
            const partialError = new DatabaseError('Partial error', 0, 'error');
            partialError.code = '23505';
            partialError.table = 'users';
            partialError.column = 'password';
            mockPool.query.mockRejectedValueOnce(partialError);

            await expect(repository.updatePassword('1', 'newpassword')).rejects.toMatchObject({
                code: '23505',
                message: 'Partial error',
                metadata: {
                    table: 'users',
                    column: 'password'
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

        it('should update user successfully', async () => {
            mockPool.query.mockResolvedValueOnce({
                rows: [updateDto],
                rowCount: 1
            });

            const result = await repository.update(updateDto);
            expect(result).toEqual(updateDto);
            expect(mockPool.query).toHaveBeenCalledWith(
                expect.any(String),
                [updateDto.id, updateDto.username, updateDto.email]
            );
        });

        it('should throw not found error when user does not exist', async () => {
            mockPool.query.mockResolvedValueOnce({
                rows: [],
                rowCount: 0
            });

            await expect(repository.update(updateDto)).rejects.toMatchObject({
                code: DbErrorCode.NOT_FOUND,
                message: 'User not found',
                metadata: { detail: `User with id ${updateDto.id} does not exist` }
            });
        });

        it('should handle database error with IGenericDatabaseError', async () => {
            const genericError = {
                code: DbErrorCode.FOREIGN_KEY_VIOLATION,
                message: 'Foreign key violation',
                metadata: { detail: 'Role does not exist' }
            };
            mockPool.query.mockRejectedValueOnce(genericError);

            await expect(repository.update(updateDto)).rejects.toEqual(genericError);
        });

        it('should handle unique constraint violations', async () => {
            const error = createDatabaseError(
                '23505',
                'Key (email)=(updated@example.com) already exists',
                'users_email_key',
                'users',
                'email'
            );
            mockPool.query.mockRejectedValueOnce(error);

            await expect(repository.update(updateDto)).rejects.toMatchObject({
                code: DbErrorCode.UNIQUE_VIOLATION,
                metadata: {
                    detail: 'Key (email)=(updated@example.com) already exists',
                    constraint: 'users_email_key',
                    table: 'users',
                    column: 'email'
                }
            });
        });

        it('should handle non-database errors', async () => {
            mockPool.query.mockRejectedValueOnce(new Error('Database error'));

            await expect(repository.update(updateDto)).rejects.toMatchObject({
                code: DbErrorCode.UNKNOWN_ERROR,
                message: 'An unexpected error occurred while updating user',
                metadata: { detail: 'Database error' }
            });
        });
    });

    describe('delete', () => {
        it('should delete user successfully', async () => {
            mockPool.query.mockResolvedValueOnce({
                rows: [],
                rowCount: 1
            });

            const result = await repository.delete('1');
            expect(result).toBe(true);
            expect(mockPool.query).toHaveBeenCalledWith(
                expect.any(String),
                ['1']
            );
        });

        it('should return false when user does not exist', async () => {
            mockPool.query.mockResolvedValueOnce({
                rows: [],
                rowCount: 0
            });

            const result = await repository.delete('1');
            expect(result).toBe(false);
        });

        it('should handle database errors', async () => {
            mockPool.query.mockRejectedValueOnce(new Error('Database error'));

            await expect(repository.delete('1')).rejects.toMatchObject({
                code: DbErrorCode.UNKNOWN_ERROR
            });
        });

        it('should handle database errors with full metadata', async () => {
            const error = createDatabaseError(
                '23503',
                'Foreign key violation',
                'tasks_user_id_fkey',
                'tasks',
                'user_id'
            );
            mockPool.query.mockRejectedValueOnce(error);

            await expect(repository.delete('1')).rejects.toMatchObject({
                code: '23503',
                message: 'Foreign key violation',
                metadata: {
                    detail: 'Foreign key violation',
                    constraint: 'tasks_user_id_fkey',
                    table: 'tasks',
                    column: 'user_id'
                }
            });
        });

        it('should handle non-database errors with custom message', async () => {
            const error = new Error('Network error');
            mockPool.query.mockRejectedValueOnce(error);

            await expect(repository.delete('1')).rejects.toMatchObject({
                code: DbErrorCode.UNKNOWN_ERROR,
                message: 'An unexpected error occurred while deleting user',
                metadata: { detail: 'Network error' }
            });
        });
    });
});
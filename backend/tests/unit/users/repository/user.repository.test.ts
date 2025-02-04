import { UserRepository } from '../../../../src/users/repository/user.repository.js';
import { User } from '../../../../src/users/models/entities/user.entity.js';
import { IDatabasePool } from '../../../../src/shared/models/interfaces/base/i-database-pool.js';
import { DbErrorCode } from '../../../../src/shared/models/constants/db-error-code.enum.js';
import { DatabaseError } from 'pg';
import { IGenericDatabaseError } from '../../../../src/shared/models/interfaces/base/i-database-error.js';

describe('UserRepository', () => {
    let repository: UserRepository;
    let mockPool: jest.Mocked<IDatabasePool>;

    beforeEach(() => {
        mockPool = {
            query: jest.fn(),
            rowCount: 1
        } as any;
        repository = new UserRepository(mockPool);
    });

    describe('create', () => {
        const mockUser: User = {
            id: '123',
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123'
        };

        const mockCreatedUser = {
            id: '123',
            username: 'testuser',
            email: 'test@example.com'
        };

        it('should create a user successfully', async () => {
            mockPool.query.mockResolvedValueOnce({ 
                rows: [mockCreatedUser],
                rowCount: 1
            });

            const result = await repository.create(mockUser);

            expect(result).toEqual(mockCreatedUser);
            expect(mockPool.query).toHaveBeenCalledWith(
                expect.any(String),
                [mockUser.username, mockUser.email, expect.any(String)]
            );
        });

        it('should transform database errors correctly', async () => {
            const pgError = new DatabaseError(
                'Key (email)=(test@example.com) already exists',
                42,
                'error'
            );
            
            Object.assign(pgError, {
                severity: 'ERROR',
                code: '23505',
                detail: 'Key (email)=(test@example.com) already exists',
                constraint: 'users_email_key',
                table: 'users',
                column: 'email',
                schema: 'public',
                file: 'nbtinsert.c',
                line: '434',
                routine: '_bt_check_unique'
            });

            mockPool.query.mockRejectedValueOnce(pgError);

            try {
                await repository.create(mockUser);
                fail('Should have thrown an error');
            } catch (error) {
                const dbError = error as IGenericDatabaseError;
                expect(dbError.code).toBe(DbErrorCode.UNIQUE_VIOLATION);
                expect(dbError.metadata?.constraint).toBe('users_email_key');
                expect(dbError.metadata?.detail).toBe('Key (email)=(test@example.com) already exists');
                expect(dbError.metadata?.table).toBe('users');
                expect(dbError.metadata?.column).toBe('email');
            }
        });

        it('should handle unknown errors', async () => {
            const unknownError = new Error('Unknown error');
            mockPool.query.mockRejectedValueOnce(unknownError);

            try {
                await repository.create(mockUser);
                fail('Should have thrown an error');
            } catch (error) {
                const dbError = error as IGenericDatabaseError;
                expect(dbError.code).toBe(DbErrorCode.UNKNOWN_ERROR);
                expect(dbError.message).toBe('An unexpected error occurred while creating user');
            }
        });
    });

    describe('findAll', () => {
        it('should return all users successfully', async () => {
            const mockUsers: User[] = [
                { id: '1', username: 'user1', email: 'user1@example.com', password: 'password1' },
                { id: '2', username: 'user2', email: 'user2@example.com', password: 'password2' }
            ];  

            mockPool.query.mockResolvedValueOnce({
                rows: mockUsers,
                rowCount: 2
            });

            const result = await repository.findAll();

            expect(result).toEqual(mockUsers);
            expect(mockPool.query).toHaveBeenCalledWith(expect.any(String));
        });

        it('should handle unknown errors', async () => {
            const unknownError = new Error('Unknown error');
            mockPool.query.mockRejectedValueOnce(unknownError);

            try {
                await repository.findAll();
                fail('Should have thrown an error');
            } catch (error) {
                const dbError = error as IGenericDatabaseError;
                expect(dbError.code).toBe(DbErrorCode.UNKNOWN_ERROR);
                expect(dbError.message).toBe('An unexpected error occurred while finding all users');
            }
        });
    });

    describe('findById', () => {
        it('should return a user successfully', async () => {
            const mockUser: User = { id: '1', username: 'user1', email: 'user1@example.com', password: 'password1' };

            mockPool.query.mockResolvedValueOnce({
                rows: [mockUser],
                rowCount: 1
            });

            const result = await repository.findById('1');

            expect(result).toEqual(mockUser);   
            expect(mockPool.query).toHaveBeenCalledWith(expect.any(String), ['1']);
        });

        it('should handle unknown errors', async () => {
            const unknownError = new Error('Unknown error');
            mockPool.query.mockRejectedValueOnce(unknownError);

            try {
                await repository.findById('1');
                fail('Should have thrown an error');
            } catch (error) {
                const dbError = error as IGenericDatabaseError;
                expect(dbError.code).toBe(DbErrorCode.UNKNOWN_ERROR);
                expect(dbError.message).toBe('An unexpected error occurred while finding user by id');
            }
        });
    });
});

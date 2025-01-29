import { UserRepository } from '../../../../src/users/repository/user.repository';
import { userMock } from '../../../__mocks__/entities/user.mock';
import { poolMock, queryResultMock } from '../../../__mocks__/config/database.mock';
import { DataBaseException } from '../../../../src/shared/models/exceptions/database.exception';
import { DataBaseErrorCode } from '../../../../src/shared/models/exceptions/enums/data-base-error-code.enum';

describe('UserRepository', () => {
    let userRepository: UserRepository;

    beforeEach(() => {
        jest.clearAllMocks();
        userRepository = new UserRepository();
    });

    describe('create', () => {
        it('should create a new user successfully', async () => {
            const newUser = {
                username: 'testUser',
                email: 'test@test.com',
                password: 'hashedPassword123'
            };

            poolMock.query.mockResolvedValue({
                rows: [{
                    id: '1',
                    username: 'testUser',
                    email: 'test@test.com',
                    password: 'hashedPassword123'
                }],
                rowCount: 1
            });

            const result = await userRepository.create(newUser);

            expect(poolMock.query).toHaveBeenCalledWith(
                'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
                [newUser.username, newUser.email, newUser.password]
            );

            expect(result).toEqual({
                id: '1',
                username: 'testUser',
                email: 'test@test.com',
                password: 'hashedPassword123'
            });
        });

        it('should throw DataBaseException on unique constraint violation', async () => {
            const newUser = userMock.createUserData;
            const dbError = {
                code: DataBaseErrorCode.UNIQUE_VIOLATION,
                constraint: 'users_email_key',
                detail: 'Key (email)=(test@test.com) already exists.'
            };
            poolMock.query.mockRejectedValue(dbError);

            await expect(userRepository.create(newUser))
                .rejects
                .toMatchObject({
                    name: 'DatabaseException',
                    message: 'Unique constraint violation',
                    code: DataBaseErrorCode.UNIQUE_VIOLATION,
                    metadata: {
                        constraint: 'users_email_key',
                        detail: 'Key (email)=(test@test.com) already exists.'
                    }
                });
        });

        it('should throw DataBaseException on not null violation', async () => {
            const newUser = userMock.createUserData;
            const dbError = {
                code: DataBaseErrorCode.NOT_NULL_VIOLATION,
                constraint: 'users_username_not_null',
                detail: 'Null value in column "username" violates not-null constraint'
            };
            poolMock.query.mockRejectedValue(dbError);

            await expect(userRepository.create(newUser))
                .rejects
                .toThrow(DataBaseException);

            await expect(userRepository.create(newUser))
                .rejects
                .toMatchObject({
                    code: DataBaseErrorCode.NOT_NULL_VIOLATION
                });
        });

        it('should throw DataBaseException on invalid input', async () => {
            const newUser = userMock.createUserData;
            const dbError = {
                code: DataBaseErrorCode.INVALID_INPUT,
                detail: 'Invalid email format'
            };
            poolMock.query.mockRejectedValue(dbError);

            await expect(userRepository.create(newUser))
                .rejects
                .toMatchObject({
                    name: 'DatabaseException',
                    code: DataBaseErrorCode.INVALID_INPUT,
                    metadata: {
                        detail: 'Invalid email format'
                    }
                });
        });

        it('should throw DataBaseException on unknown error', async () => {
            const newUser = userMock.createUserData;
            const dbError = {
                code: DataBaseErrorCode.UNKNOWN_ERROR,
                detail: 'Unexpected database error'
            };
            poolMock.query.mockRejectedValue(dbError);

            await expect(userRepository.create(newUser))
                .rejects
                .toMatchObject({
                    name: 'DatabaseException',
                    code: DataBaseErrorCode.UNKNOWN_ERROR,
                    metadata: {
                        detail: 'Unexpected database error'
                    }
                });
        });
    });

    describe('findAll', () => {
        it('should return users array when rows exist', async () => {
            poolMock.query.mockResolvedValue({
                rows: userMock.userList,
                rowCount: userMock.userList.length
            });

            const result = await userRepository.findAll();
            expect(result).toEqual(userMock.userList);
        });

        it('should return empty array when rows is undefined', async () => {
            
            poolMock.query.mockResolvedValue({
                rows: [],
                rowCount: 0
            });


            // Act
            const result = await userRepository.findAll();

            // Assert
            expect(result).toEqual([]);
        });

        it('should return empty array when rows is null', async () => {
            // Arrange
            poolMock.query.mockResolvedValue({
                rows: null,
                rowCount: 0
            });

            // Act
            const result = await userRepository.findAll();

            // Assert
            expect(result).toEqual([]);
        });

        it('should throw DataBaseException when user not found', async () => {
            poolMock.query.mockRejectedValue({
                code: DataBaseErrorCode.NOT_FOUND,
                constraint: 'user_id',
                detail: 'User not found'
            });

            await expect(userRepository.findAll())
                .rejects
                .toMatchObject({
                    code: DataBaseErrorCode.NOT_FOUND
                });
        });

        it('should throw DataBaseException on database error', async () => {
            poolMock.query.mockRejectedValue(new Error('Database connection error'));

            await expect(userRepository.findAll())
                .rejects
                .toMatchObject({
                    name: 'DatabaseException',
                    message: 'Unknown database error',
                    code: DataBaseErrorCode.UNKNOWN_ERROR
                });
        });
    });

    describe('findById', () => {
        it('should return user when found', async () => {
            const userId = '1';
            poolMock.query.mockResolvedValue({
                rows: [{
                    id: '1',
                    username: 'testUser',
                    email: 'test@test.com',
                    password: 'hashedPassword123'
                }],
                rowCount: 1
            });

            const result = await userRepository.findById(userId);

            expect(poolMock.query).toHaveBeenCalledWith(
                'SELECT * FROM users WHERE id = $1',
                [userId]
            );

            expect(result).toEqual({
                id: '1',
                username: 'testUser',
                email: 'test@test.com',
                password: 'hashedPassword123',
            });
        });

        it('should return null when user not found', async () => {
            const userId = '999';
            poolMock.query.mockResolvedValue({
                rows: [],
                rowCount: 0
            });

            const result = await userRepository.findById(userId);

            expect(result).toBeNull();
            expect(poolMock.query).toHaveBeenCalledWith(
                'SELECT * FROM users WHERE id = $1',
                [userId]
            );
        });

        it('should throw DataBaseException on database error', async () => {
            const userId = '1';
            poolMock.query.mockRejectedValue(new Error('DB connection failed'));

            await expect(userRepository.findById(userId))
                .rejects
                .toThrow(DataBaseException);
        });

        it('should throw DataBaseException when user not found', async () => {
            const userId = '999';
            poolMock.query.mockRejectedValue({
                code: DataBaseErrorCode.NOT_FOUND,
                constraint: 'user_id',
                detail: 'User not found'
            });

            await expect(userRepository.findById(userId))
                .rejects
                .toMatchObject({
                    code: DataBaseErrorCode.NOT_FOUND
                });
        });
    });


    describe('findByUsername', () => {
        it('should return user when found', async () => {
            const username = 'testUser';
            poolMock.query.mockResolvedValue({
                rows: [{
                    id: '1',
                    username: 'testUser',
                    email: 'test@test.com',
                    password: 'hashedPassword123'
                }],
                rowCount: 1
            });

            const result = await userRepository.findByUsername(username);

            expect(poolMock.query).toHaveBeenCalledWith(
                'SELECT * FROM users WHERE username = $1',
                [username]
            );

            expect(result).toEqual({
                id: '1',
                username: 'testUser',
                email: 'test@test.com',
                password: 'hashedPassword123'
            });
        });

        it('should return null when user not found', async () => {
            const username = 'nonexistentUser';
            poolMock.query.mockResolvedValue({
                rows: [],
                rowCount: 0
            });

            const result = await userRepository.findByUsername(username);

            expect(result).toBeNull();
            expect(poolMock.query).toHaveBeenCalledWith(
                'SELECT * FROM users WHERE username = $1',
                [username]
            );
        });

        it('should throw DataBaseException on database error', async () => {
            const username = 'testUser';
            poolMock.query.mockRejectedValue(new Error('DB connection failed'));

            await expect(userRepository.findByUsername(username))
                .rejects
                .toThrow(DataBaseException);
        });

        it('should throw DataBaseException on undefined column', async () => {
            const username = 'testuser';
            poolMock.query.mockRejectedValue({
                code: DataBaseErrorCode.UNDEFINED_COLUMN,
                detail: 'Column does not exist'
            });

            await expect(userRepository.findByUsername(username))
                .rejects
                .toMatchObject({
                    code: DataBaseErrorCode.UNDEFINED_COLUMN
                });
        });

        it('should throw DataBaseException when user not found', async () => {
            const username = 'nonexistentUser';
            poolMock.query.mockRejectedValue({
                code: DataBaseErrorCode.NOT_FOUND,
                constraint: 'user_id',
                detail: 'User not found'
            });

            await expect(userRepository.findByUsername(username))
                .rejects
                .toMatchObject({
                    code: DataBaseErrorCode.NOT_FOUND
                });
        });
    });


    describe('findByEmail', () => {
        it('should return null when query succeeds but no user is found', async () => {
            const email = 'nonexistent@test.com';
            poolMock.query.mockResolvedValue({
                rows: [],
                rowCount: 0
            });

            const result = await userRepository.findByEmail(email);

            expect(result).toBeNull();
            expect(poolMock.query).toHaveBeenCalledWith(
                'SELECT * FROM users WHERE email = $1',
                [email]
            );
        });

        it('should return user when query succeeds and user is found', async () => {
            const email = 'test@test.com';
            const user = {
                id: '1',
                email: 'test@test.com',
                username: 'test'
            };
            
            poolMock.query.mockResolvedValue({
                rows: [user],
                rowCount: 1
            });

            const result = await userRepository.findByEmail(email);

            expect(result).toEqual(user);
        });

        it('should throw DataBaseException on database error', async () => {
            const email = 'test@test.com';
            poolMock.query.mockRejectedValue(new Error('DB connection failed'));

            await expect(userRepository.findByEmail(email))
                .rejects
                .toThrow(DataBaseException);
        });

        it('should throw DataBaseException on undefined column', async () => {
            const email = 'test@test.com';
            poolMock.query.mockRejectedValue({
                code: DataBaseErrorCode.UNDEFINED_COLUMN,
                detail: 'Column does not exist'
            });

            await expect(userRepository.findByEmail(email))
                .rejects
                .toMatchObject({
                    code: DataBaseErrorCode.UNDEFINED_COLUMN
                });
        });

        it('should throw DataBaseException when user not found', async () => {
            const email = 'nonexistent@test.com';
            poolMock.query.mockRejectedValue({
                code: DataBaseErrorCode.NOT_FOUND,
                constraint: 'user_id',
                detail: 'User not found'
            });

            await expect(userRepository.findByEmail(email))
                .rejects
                .toMatchObject({
                    code: DataBaseErrorCode.NOT_FOUND
                });
        });
    });
    
    describe('update', () => {
        it('should update user successfully', async () => {
            const updateUser = {
                id: '1',
                username: 'updatedUser',
                email: 'updated@test.com'
            };

            poolMock.query.mockResolvedValueOnce({
                rows: [{ id: '1', username: 'oldUser', email: 'old@test.com' }],
                rowCount: 1
            });

            poolMock.query.mockResolvedValueOnce({
                rows: [updateUser],
                rowCount: 1
            });

            const result = await userRepository.update(updateUser);

            expect(poolMock.query).toHaveBeenNthCalledWith(1,
                'SELECT * FROM users WHERE id = $1',
                [updateUser.id]
            );

            expect(poolMock.query).toHaveBeenNthCalledWith(2,
                expect.stringMatching(/UPDATE users[\s\n]+SET username = \$1, email = \$2[\s\n]+WHERE id = \$3[\s\n]+RETURNING \*/),
                [updateUser.username, updateUser.email, updateUser.id]
            );

            expect(result).toEqual(updateUser);
        });

        it('should throw DataBaseException on database error', async () => {
            const updateUser = {
                id: '1',
                username: 'updatedUser',
                email: 'updated@test.com'
            };
            poolMock.query.mockRejectedValue(new Error('DB connection failed'));

            await expect(userRepository.update(updateUser))
                .rejects
                .toThrow(DataBaseException);
        });

        it('should throw DataBaseException on unique constraint violation', async () => {
            const updateUser = {
                id: '1',
                username: 'test',
                email: 'existing@test.com'
            };
            
            poolMock.query.mockResolvedValueOnce({
                rows: [{ id: '1' }],
                rowCount: 1
            });

            poolMock.query.mockRejectedValueOnce({
                code: DataBaseErrorCode.UNIQUE_VIOLATION,
                constraint: 'users_email_key',
                detail: 'Key (email)=(existing@test.com) already exists.'
            });

            await expect(userRepository.update(updateUser))
                .rejects
                .toMatchObject({
                    name: 'DatabaseException',
                    code: DataBaseErrorCode.UNIQUE_VIOLATION,
                    metadata: {
                        constraint: 'users_email_key',
                        detail: 'Key (email)=(existing@test.com) already exists.'
                    }
                });
        });

        it('should throw DataBaseException on not null violation', async () => {
            const updateUser = {
                id: '1',
                username: undefined,
                email: 'test@test.com'
            };
            
            poolMock.query.mockResolvedValueOnce({
                rows: [{ id: '1' }],
                rowCount: 1
            });

            poolMock.query.mockRejectedValueOnce({
                code: DataBaseErrorCode.NOT_NULL_VIOLATION,
                constraint: 'users_username_not_null',
                detail: 'Column username cannot be null'
            });

            await expect(userRepository.update(updateUser))
                .rejects
                .toMatchObject({
                    name: 'DatabaseException',
                    code: DataBaseErrorCode.NOT_NULL_VIOLATION,
                    metadata: {
                        constraint: 'users_username_not_null',
                        detail: 'Column username cannot be null'
                    }
                });
        });

        it('should throw DataBaseException on unknown error', async () => {
            const updateUser = {
                id: '1',
                username: 'test',
                email: 'test@test.com'
            };
            
            poolMock.query.mockResolvedValueOnce({
                rows: [{ id: '1' }],
                rowCount: 1
            });

            poolMock.query.mockRejectedValueOnce({
                code: DataBaseErrorCode.UNKNOWN_ERROR,
                detail: 'Unexpected database error'
            });

            await expect(userRepository.update(updateUser))
                .rejects
                .toMatchObject({
                    name: 'DatabaseException',
                    code: DataBaseErrorCode.UNKNOWN_ERROR,
                    metadata: {
                        detail: 'Unexpected database error'
                    }
                });
        });

        it('should throw DataBaseException when user not found', async () => {
            const updateUser = {
                id: '999',
                username: 'test'
            };

            poolMock.query.mockResolvedValue({
                rows: [],
                rowCount: 0
            });

            await expect(userRepository.update(updateUser))
                .rejects
                .toMatchObject({
                    code: DataBaseErrorCode.NOT_FOUND
                });
        });
    });

    describe('updatePassword', () => {
        it('should update password successfully', async () => {
            const userId = '1';
            const newHashedPassword = 'newHashedPassword';
            poolMock.query.mockResolvedValue({
                rows: [],
                rowCount: 1
            });

            await userRepository.updatePassword(userId, newHashedPassword);

            expect(poolMock.query).toHaveBeenCalledWith(
                'UPDATE users SET password = $1 WHERE id = $2',
                [newHashedPassword, userId]
            );
        });

        it('should throw DataBaseException on database error', async () => {
            const userId = '1';
            const newHashedPassword = 'newHashedPassword';
            poolMock.query.mockRejectedValue(new Error('DB connection failed'));

            await expect(userRepository.updatePassword(userId, newHashedPassword))
                .rejects
                .toThrow(DataBaseException);
        });

        it('should throw DataBaseException when user not found', async () => {
            const userId = '999';
            const newPassword = 'newpass';

            poolMock.query.mockRejectedValue({
                code: DataBaseErrorCode.NOT_FOUND
            });

            await expect(userRepository.updatePassword(userId, newPassword))
                .rejects
                .toMatchObject({
                    code: DataBaseErrorCode.NOT_FOUND
                });
        });
    });

    describe('delete', () => {
        it('should delete user successfully', async () => {
            const userId = '1';
            poolMock.query.mockResolvedValue({
                rows: [],
                rowCount: 1
            });

            await userRepository.delete(userId);

            expect(poolMock.query).toHaveBeenCalledWith(
                'DELETE FROM users WHERE id = $1',
                [userId]
            );
        });

        it('should throw DataBaseException on database error', async () => {
            const userId = '1';
            poolMock.query.mockRejectedValue(new Error('DB connection failed'));

            await expect(userRepository.delete(userId))
                .rejects
                .toThrow(DataBaseException);
        });

        it('should throw DataBaseException on foreign key violation', async () => {
            const userId = '1';
            poolMock.query.mockRejectedValue({
                code: DataBaseErrorCode.FOREIGN_KEY_VIOLATION,
                constraint: 'fk_posts_user_id',
                detail: 'User has related posts'
            });

            await expect(userRepository.delete(userId))
                .rejects
                .toMatchObject({
                    name: 'DatabaseException',
                    code: DataBaseErrorCode.FOREIGN_KEY_VIOLATION,
                    metadata: {
                        constraint: 'fk_posts_user_id',
                        detail: 'User has related posts'
                    }
                });
        });

        it('should throw DataBaseException when user not found', async () => {
            const userId = '999';
            poolMock.query.mockRejectedValue({
                code: DataBaseErrorCode.NOT_FOUND
            });

            await expect(userRepository.delete(userId))
                .rejects
                .toMatchObject({
                    code: DataBaseErrorCode.NOT_FOUND
                });
        });

        it('should throw DataBaseException on unknown error', async () => {
            const userId = '1';
            poolMock.query.mockRejectedValue({
                code: 'SOME_UNKNOWN_ERROR'
            });

            await expect(userRepository.delete(userId))
                .rejects
                .toMatchObject({
                    code: DataBaseErrorCode.UNKNOWN_ERROR
                });
        });
    });
});

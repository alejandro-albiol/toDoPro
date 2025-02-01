import { UserRepository } from '../../../../src/users/repository/user.repository';
import { userMock } from '../../../__mocks__/entities/user.mock';
import { DataBaseException } from '../../../../src/shared/models/exceptions/database.exception';
import { DataBaseErrorCode } from '../../../../src/shared/models/exceptions/enums/data-base-error-code.enum';
import { queryResultMock } from '../../../__mocks__/database/query.mock';       

let userRepository: UserRepository;
const poolMock = {
    query: jest.fn()
};

describe('UserRepository', () => {
    beforeEach(() => {
        userRepository = new UserRepository(poolMock);
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('create', () => {
        it('should create user successfully', async () => {
            poolMock.query.mockResolvedValue({
                rows: [userMock.validUser],
                rowCount: 1
            });
            
            const result = await userRepository.create(userMock.validUser);
            
            expect(result).toEqual(userMock.validUser);
            expect(poolMock.query).toHaveBeenCalledWith(
                expect.any(String),
                [userMock.validUser.username, userMock.validUser.email, userMock.validUser.password]
            );
        });

        it('should throw DataBaseException on unique violation', async () => {
            poolMock.query.mockRejectedValue(queryResultMock.dbErrors.uniqueViolation);
            await expect(userRepository.create(userMock.validUser))
                .rejects
                .toThrow(DataBaseException);
        });
    });

        it('should throw DataBaseException on unique constraint violation', async () => {
            const dbError = {
                code: DataBaseErrorCode.UNIQUE_VIOLATION,
                constraint: 'users_email_key',
                detail: 'Key (email)=(test@test.com) already exists.'
            };
            poolMock.query.mockRejectedValue(dbError);

            await expect(userRepository.create(userMock.createUserData))
                .rejects
                .toMatchObject({
                    name: 'DatabaseException',
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
                rowCount: 2
            });

            const result = await userRepository.findAll();
            expect(result).toEqual(userMock.userList);
        });

        it('should return empty array when no rows exist', async () => {
            poolMock.query.mockResolvedValue({
                rows: [],
                rowCount: 0
            });

            const result = await userRepository.findAll();
            expect(result).toEqual([]);
        });

        it('should throw DataBaseException on database error', async () => {
            poolMock.query.mockRejectedValue(new Error('DB connection failed'));

            await expect(userRepository.findAll())
                .rejects
                .toMatchObject({
                    code: DataBaseErrorCode.UNKNOWN_ERROR
                });
        });
    });

    describe('findById', () => {
        it('should return user when found', async () => {
            poolMock.query.mockResolvedValue({
                rows: [userMock.validUser],
                rowCount: 1
            });

            const result = await userRepository.findById('1');
            expect(result).toEqual(userMock.validUser);
        });

        it('should return null when user not found', async () => {
            poolMock.query.mockResolvedValue({
                rows: [],
                rowCount: 0
            });

            const result = await userRepository.findById('999');
            expect(result).toBeNull();
        });

        it('should throw DataBaseException on database error', async () => {
            poolMock.query.mockRejectedValue(new Error('DB connection failed'));

            await expect(userRepository.findById('1'))
                .rejects
                .toMatchObject({
                    code: DataBaseErrorCode.UNKNOWN_ERROR
                });
        });
    });


    describe('findByUsername', () => {
        it('should return user when found', async () => {
            poolMock.query.mockResolvedValue({
                rows: [userMock.validUser],
                rowCount: 1
            });

            const result = await userRepository.findByUsername(userMock.validUser.username);

            expect(poolMock.query).toHaveBeenCalledWith(
                'SELECT * FROM users WHERE username = $1',
                [userMock.validUser.username]
            );

            expect(result).toEqual(userMock.validUser);
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
                rows: [{ id: '1' }],
                rowCount: 1
            });

            // Mock para update
            poolMock.query.mockResolvedValueOnce({
                rows: [{ ...updateUser }],
                rowCount: 1
            });

            const result = await userRepository.update(updateUser);
            expect(result).toEqual(updateUser);
        });

        it('should throw DataBaseException when user not found', async () => {
            const updateUser = { id: '999' };
            poolMock.query.mockResolvedValueOnce({
                rows: [],
                rowCount: 0
            });

            await expect(userRepository.update(updateUser))
                .rejects
                .toMatchObject({
                    code: DataBaseErrorCode.NOT_FOUND,
                    message: 'User not found',
                    metadata: {
                        detail: 'User with id 999 not found'
                    }
                });
        });

        it('should throw DataBaseException on unique constraint violation', async () => {
            const updateUser = { id: '1', email: 'test@test.com' };
            
            // Mock para verificar existencia
            poolMock.query.mockResolvedValueOnce({
                rows: [{ id: '1' }],
                rowCount: 1
            });

            // Mock para el error de unique violation
            poolMock.query.mockRejectedValueOnce({
                code: DataBaseErrorCode.UNIQUE_VIOLATION,
                constraint: 'users_email_key',
                detail: 'Key (email)=(test@test.com) already exists'
            });

            await expect(userRepository.update(updateUser))
                .rejects
                .toMatchObject({
                    code: DataBaseErrorCode.UNIQUE_VIOLATION,
                    metadata: {
                        constraint: 'users_email_key',
                        detail: 'Key (email)=(test@test.com) already exists'
                    }
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
            poolMock.query.mockResolvedValue({ rows: [], rowCount: 1 });

            const result = await userRepository.delete(userId);

            expect(result).toBe(true);
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
            poolMock.query.mockResolvedValue({
                rows: [],
                rowCount: 0
            });

            await expect(userRepository.delete(userId))
                .rejects
                .toMatchObject({
                    code: DataBaseErrorCode.NOT_FOUND,
                    message: 'User not found',
                    metadata: {
                        detail: `User with id ${userId} not found`
                    }
                });
        });

        it('should throw DataBaseException on unknown error', async () => {
            const userId = '1';
            poolMock.query.mockRejectedValue({
                code: DataBaseErrorCode.UNKNOWN_ERROR
            });

            await expect(userRepository.delete(userId))
                .rejects
                .toMatchObject({
                    code: DataBaseErrorCode.UNKNOWN_ERROR,
                    message: 'Unknown database error'
                });
        });
    });

    describe('error handling', () => {
        it('should throw DataBaseException on foreign key violation during update', async () => {
            const updateUser = { id: '1', roleId: '999' };
            
            poolMock.query.mockResolvedValueOnce({
                rows: [{ id: '1' }],
                rowCount: 1
            });

            poolMock.query.mockRejectedValueOnce({
                code: DataBaseErrorCode.FOREIGN_KEY_VIOLATION,
                constraint: 'users_role_id_fkey',
                detail: 'Key (role_id)=(999) is not present in table "roles"'
            });

            await expect(userRepository.update(updateUser))
                .rejects
                .toMatchObject({
                    code: DataBaseErrorCode.FOREIGN_KEY_VIOLATION,
                    metadata: {
                        constraint: 'users_role_id_fkey',
                        detail: 'Key (role_id)=(999) is not present in table "roles"'
                    }
                });
        });

        it('should throw DataBaseException on invalid input during create', async () => {
            const newUser = {
                username: 'test',
                email: 'invalid-email',
                password: 'password123'
            };

            poolMock.query.mockRejectedValue({
                code: DataBaseErrorCode.INVALID_INPUT,
                detail: 'Invalid email format'
            });

            await expect(userRepository.create(newUser))
                .rejects
                .toMatchObject({
                    code: DataBaseErrorCode.INVALID_INPUT,
                    metadata: {
                        detail: 'Invalid email format'
                    }
                });
        });
    }
);
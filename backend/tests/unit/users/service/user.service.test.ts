import { UserService } from '../../../../src/users/service/user.service';
import { UserRepository } from '../../../../src/users/repository/user.repository';
import { userMock } from '../../../__mocks__/entities/user.mock';
import { UserCreationFailedException } from '../../../../src/users/exceptions/user-creation-failed.exception';
import { EmailAlreadyExistsException } from '../../../../src/users/exceptions/email-already-exists.exception';
import { UsernameAlreadyExistsException } from '../../../../src/users/exceptions/username-already-exists.exception';
import { InvalidUserDataException } from '../../../../src/users/exceptions/invalid-user-data.exception';
import { DataBaseException } from '../../../../src/shared/models/exceptions/database.exception';
import { DataBaseErrorCode } from '../../../../src/shared/models/exceptions/enums/data-base-error-code.enum';
import { HashService } from '../../../../src/shared/services/hash.service';
import { User } from '../../../../src/users/models/entities/user.entity';
import { UserNotFoundException } from '../../../../src/users/exceptions/user-not-found.exception';
import { UpdatedUserDTO } from '../../../../src/users/models/dtos/updated-user.dto';

describe('UserService', () => {
    let userService: UserService;
    let mockUserRepository: jest.Mocked<UserRepository>;

    beforeEach(() => {
        mockUserRepository = {
            create: jest.fn(),
            findById: jest.fn(),
            findByUsername: jest.fn(),
            findByEmail: jest.fn(),
            update: jest.fn(),
            updatePassword: jest.fn(),
            delete: jest.fn()
        } as unknown as jest.Mocked<UserRepository>;

        userService = new UserService(mockUserRepository);
    });
    
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create user successfully', async () => {
            const hashedPassword = 'hashedPassword123';
            jest.spyOn(HashService, 'hashPassword').mockResolvedValue(hashedPassword);
            
            mockUserRepository.create.mockResolvedValue({
                ...userMock.validUser,
                password: hashedPassword
            });

            const result = await userService.create(userMock.createUserData);

            expect(result).toEqual({
                ...userMock.validUser,
                password: hashedPassword
            });
            expect(mockUserRepository.create).toHaveBeenCalledWith({
                ...userMock.createUserData,
                password: hashedPassword
            });
        });

        it('should throw EmailAlreadyExistsException when email exists', async () => {
            mockUserRepository.create.mockRejectedValue(
                new DataBaseException(
                    'Key (email)=(test@test.com) already exists',
                    DataBaseErrorCode.UNIQUE_VIOLATION
                )
            );

            await expect(userService.create(userMock.createUserData))
                .rejects
                .toThrow(EmailAlreadyExistsException);
        });

        it('should throw UsernameAlreadyExistsException when username exists', async () => {
            mockUserRepository.create.mockRejectedValue(
                new DataBaseException(
                    'Key (username)=(testUser) already exists',
                    DataBaseErrorCode.UNIQUE_VIOLATION
                )
            );

            await expect(userService.create(userMock.createUserData))
                .rejects
                .toThrow(UsernameAlreadyExistsException);
        });

        it('should throw InvalidUserDataException on invalid input', async () => {
            mockUserRepository.create.mockRejectedValue(
                new DataBaseException(
                    'Invalid input data',
                    DataBaseErrorCode.INVALID_INPUT
                )
            );

            await expect(userService.create(userMock.createUserData))
                .rejects
                .toThrow(InvalidUserDataException);
        });

        it('should throw UserCreationFailedException when creation returns null', async () => {
            mockUserRepository.create.mockResolvedValue(null as unknown as User);

            await expect(userService.create(userMock.createUserData))
                .rejects
                .toThrow(UserCreationFailedException);
        });

        it('should throw DatabaseException on unknown error', async () => {
            mockUserRepository.create.mockRejectedValue(
                new Error('Unknown error')
            );

            await expect(userService.create(userMock.createUserData))
                .rejects
                .toThrow(DataBaseException);
        });

        it('should use "unknown" when email is undefined in EmailAlreadyExistsException', async () => {
            const userDataWithoutEmail = { ...userMock.createUserData, email: undefined as unknown as string };
            mockUserRepository.create.mockRejectedValue(
                new DataBaseException(
                    'Key (email)=() already exists',
                    DataBaseErrorCode.UNIQUE_VIOLATION
                )
            );

            await expect(userService.create(userDataWithoutEmail))
                .rejects
                .toThrowError(expect.objectContaining({
                    message: "User with email 'unknown' already exists",
                    name: 'EmailAlreadyExistsException'
                }));
        });

        it('should use "unknown" when username is undefined in UsernameAlreadyExistsException', async () => {
            const userDataWithoutUsername = { ...userMock.createUserData, username: undefined as unknown as string };
            mockUserRepository.create.mockRejectedValue(
                new DataBaseException(
                    'Key (username)=() already exists',
                    DataBaseErrorCode.UNIQUE_VIOLATION
                )
            );

            await expect(userService.create(userDataWithoutUsername))
                .rejects
                .toThrowError(expect.objectContaining({
                    message: "User with username 'unknown' already exists",
                    name: 'UsernameAlreadyExistsException'
                }));
        });
    });

    describe('findById', () => {
        it('should return a user when found', async () => {
            mockUserRepository.findById.mockResolvedValue(userMock.validUser);
            const result = await userService.findById('1');
            expect(result).toEqual(userMock.validUser);
        });

        it('should throw UserNotFoundException when user not found', async () => {
            mockUserRepository.findById.mockResolvedValue(null as unknown as User);
            await expect(userService.findById('1'))
                .rejects
                .toThrow(UserNotFoundException);
        });

        it('should throw DataBaseException on invalid input', async () => {
            mockUserRepository.findById.mockRejectedValue(
                new DataBaseException(
                    'Invalid input syntax',
                    DataBaseErrorCode.INVALID_INPUT
                )
            );

            await expect(userService.findById('a'))
                .rejects
                .toThrow(InvalidUserDataException);
        });

        it('should throw DataBaseException on unknown error', async () => {
            mockUserRepository.findById.mockRejectedValue(
                new Error('Unknown error')
            );
            await expect(userService.findById('1'))
                .rejects
                .toThrow(DataBaseException);
        });

        it('should throw UserNotFoundException when user is null', async () => {
            mockUserRepository.findById.mockResolvedValue(null);
            await expect(userService.findById('0'))
                .rejects
                .toThrow(UserNotFoundException);
        });

        it('should throw UserNotFoundException when database returns NOT_FOUND', async () => {
            mockUserRepository.findById.mockRejectedValue(
                new DataBaseException(
                    'User not found in database',
                    DataBaseErrorCode.NOT_FOUND
                )
            );

            await expect(userService.findById('1'))
                .rejects
                .toThrow(UserNotFoundException);
        });
    });

    describe('findByUsername', () => {
        it('should return a user when found', async () => {
            mockUserRepository.findByUsername.mockResolvedValue(userMock.validUser);
            const result = await userService.findByUsername('testUser');
            expect(result).toEqual(userMock.validUser);
        });

        it('should throw UserNotFoundException when user not found', async () => {
            mockUserRepository.findByUsername.mockResolvedValue(null as unknown as User);
            await expect(userService.findByUsername('testUser'))
                .rejects
                .toThrow(UserNotFoundException);
        });

        it('should throw DataBaseException on invalid input', async () => {
            mockUserRepository.findByUsername.mockRejectedValue(
                new DataBaseException(
                    'Invalid input syntax',
                    DataBaseErrorCode.INVALID_INPUT
                )
            );

            await expect(userService.findByUsername('a'))
                .rejects
                .toThrow(InvalidUserDataException);
        });

        it('should throw DataBaseException on unknown error', async () => {
            mockUserRepository.findByUsername.mockRejectedValue(
                new Error('Unknown error')
            );
            await expect(userService.findByUsername('testUser'))
                .rejects
                .toThrow(DataBaseException);
        });

        it('should throw UserNotFoundException when user is null', async () => {
            mockUserRepository.findByUsername.mockResolvedValue(null);
            await expect(userService.findByUsername('testUser'))
                .rejects
                .toThrow(UserNotFoundException);
        });

        it('should throw UserNotFoundException when database returns NOT_FOUND', async () => {
            mockUserRepository.findByUsername.mockRejectedValue(
                new DataBaseException(
                    'User not found in database',
                    DataBaseErrorCode.NOT_FOUND
                )
            );

            await expect(userService.findByUsername('testUser'))
                .rejects
                .toThrow(UserNotFoundException);
        });
    });

    describe('findByEmail', () => {
        it('should return a user when found', async () => {
            mockUserRepository.findByEmail.mockResolvedValue(userMock.validUser);
            const result = await userService.findByEmail('test@test.com');
            expect(result).toEqual(userMock.validUser);
        });

        it('should throw UserNotFoundException when user not found', async () => {
            mockUserRepository.findByEmail.mockResolvedValue(null as unknown as User);
            await expect(userService.findByEmail('test@test.com'))
                .rejects
                .toThrow(UserNotFoundException);
        });

        it('should throw DataBaseException on invalid input', async () => {
            mockUserRepository.findByEmail.mockRejectedValue(
                new DataBaseException(
                    'Invalid input syntax',
                    DataBaseErrorCode.INVALID_INPUT
                )
            );

            await expect(userService.findByEmail('a'))
                .rejects
                .toThrow(InvalidUserDataException);
        });

        it('should throw DataBaseException on unknown error', async () => {
            mockUserRepository.findByEmail.mockRejectedValue(
                new Error('Unknown error')
            );
            await expect(userService.findByEmail('test@test.com'))
                .rejects
                .toThrow(DataBaseException);
        });

        it('should throw UserNotFoundException when user is null', async () => {
            mockUserRepository.findByEmail.mockResolvedValue(null);
            await expect(userService.findByEmail('test@test.com'))
                .rejects
                .toThrow(UserNotFoundException);
        });

        it('should throw UserNotFoundException when database returns NOT_FOUND', async () => {
            mockUserRepository.findByEmail.mockRejectedValue(
                new DataBaseException(
                    'User not found in database',
                    DataBaseErrorCode.NOT_FOUND
                )
            );

            await expect(userService.findByEmail('test@test.com'))
                .rejects
                .toThrow(UserNotFoundException);
        });
    });

    describe('update', () => {
        it('should update user successfully', async () => {
            mockUserRepository.update.mockResolvedValue(userMock.validUser);
            
            const result = await userService.update(userMock.updateUserData);
            
            expect(mockUserRepository.update).toHaveBeenCalledWith(userMock.updateUserData);
            expect(result).toEqual(userMock.validUser);
        });

        it('should throw UserNotFoundException when user not found', async () => {
            mockUserRepository.update.mockRejectedValue(
                new DataBaseException(
                    'User not found',
                    DataBaseErrorCode.NOT_FOUND
                )
            );

            await expect(userService.update(userMock.updateUserData))
                .rejects
                .toThrow(UserNotFoundException);
        });

        it('should throw EmailAlreadyExistsException when email exists', async () => {
            mockUserRepository.update.mockRejectedValue(
                new DataBaseException(
                    'Key (email)=(test@test.com) already exists',
                    DataBaseErrorCode.UNIQUE_VIOLATION
                )
            );

            await expect(userService.update(userMock.updateUserData))
                .rejects
                .toThrow(EmailAlreadyExistsException);
        });

        it('should throw UsernameAlreadyExistsException when username exists', async () => {
            mockUserRepository.update.mockRejectedValue(
                new DataBaseException(
                    'Key (username)=(testUser) already exists',
                    DataBaseErrorCode.UNIQUE_VIOLATION
                )
            );

            await expect(userService.update(userMock.updateUserData))
                .rejects
                .toThrow(UsernameAlreadyExistsException);
        });

        it('should throw InvalidUserDataException on invalid input', async () => {
            mockUserRepository.update.mockRejectedValue(
                new DataBaseException(
                    'Invalid user data format',
                    DataBaseErrorCode.INVALID_INPUT
                )
            );

            await expect(userService.update(userMock.updateUserData))
                .rejects
                .toThrow(InvalidUserDataException);
        });

        it('should throw DataBaseException on unknown error', async () => {
            mockUserRepository.update.mockRejectedValue(
                new Error('Unknown error')
            );
            await expect(userService.update(userMock.updateUserData))
                .rejects
                .toThrow(DataBaseException);
        });

        it('should throw UserNotFoundException when database returns NOT_FOUND', async () => {
            mockUserRepository.update.mockRejectedValue(
                new DataBaseException(
                    'User not found in database',
                    DataBaseErrorCode.NOT_FOUND
                )
            );

            await expect(userService.update(userMock.updateUserData))
                .rejects
                .toThrow(UserNotFoundException);
        });

        it('should throw UserNotFoundException when update returns null', async () => {
            mockUserRepository.update.mockResolvedValue(null as unknown as UpdatedUserDTO);

            await expect(userService.update(userMock.updateUserData))
                .rejects
                .toThrow(DataBaseException);
        });

        it('should use "unknown" when email is undefined in EmailAlreadyExistsException', async () => {
            const updateDataWithoutEmail = { ...userMock.updateUserData, email: undefined };
            mockUserRepository.update.mockRejectedValue(
                new DataBaseException(
                    'Key (email)=() already exists',
                    DataBaseErrorCode.UNIQUE_VIOLATION
                )
            );

            await expect(userService.update(updateDataWithoutEmail))
                .rejects
                .toThrowError(expect.objectContaining({
                    message: "User with email 'unknown' already exists",
                    name: 'EmailAlreadyExistsException'
                }));
        });

        it('should use "unknown" when username is undefined in UsernameAlreadyExistsException', async () => {
            const updateDataWithoutUsername = { ...userMock.updateUserData, username: undefined };
            mockUserRepository.update.mockRejectedValue(
                new DataBaseException(
                    'Key (username)=() already exists',
                    DataBaseErrorCode.UNIQUE_VIOLATION
                )
            );

            await expect(userService.update(updateDataWithoutUsername))
                .rejects
                .toThrowError(expect.objectContaining({
                    message: "User with username 'unknown' already exists",
                    name: 'UsernameAlreadyExistsException'
                }));
        });
    });

    describe('updatePassword', () => {
        it('should update password successfully', async () => {
            mockUserRepository.updatePassword.mockResolvedValue(void 0);

            await userService.updatePassword('1', 'newPassword123');

            expect(mockUserRepository.updatePassword).toHaveBeenCalledWith('1', 'hashedPassword123');
        });

        it('should throw UserNotFoundException when user not found', async () => {
            mockUserRepository.updatePassword.mockRejectedValue(
                new DataBaseException(
                    'User not found',
                    DataBaseErrorCode.NOT_FOUND
                )
            );

            await expect(userService.updatePassword('1', 'newPassword123'))
                .rejects
                .toThrow(UserNotFoundException);
        });

        it('should throw InvalidUserDataException when invalid password format', async () => {
            mockUserRepository.updatePassword.mockRejectedValue(
                new DataBaseException(
                    'Invalid password format',
                    DataBaseErrorCode.INVALID_INPUT
                )
            );

            await expect(userService.updatePassword('1', 'newInvalidPassword'))
                .rejects
                .toThrow(InvalidUserDataException);
        });

        it('should throw DataBaseException on unknown error', async () => {
            mockUserRepository.updatePassword.mockRejectedValue(
                new Error('Unknown error')
            );
            await expect(userService.updatePassword('1', 'newPassword123'))
                .rejects
                .toThrow(DataBaseException);
        });
    });

    describe('delete', () => {
        it('should delete user successfully', async () => {
            mockUserRepository.delete.mockResolvedValue(null);

            await userService.delete('1');

            expect(mockUserRepository.delete).toHaveBeenCalledWith('1');
        });

        it('should throw UserNotFoundException when user not found', async () => {
            mockUserRepository.delete.mockRejectedValue(
                new DataBaseException(
                    'User not found',
                    DataBaseErrorCode.NOT_FOUND
                )
            );

            await expect(userService.delete('1'))
                .rejects
                .toThrow(UserNotFoundException);
        }); 

        it('should throw DataBaseException on invalid input', async () => {
            mockUserRepository.delete.mockRejectedValue(
                new DataBaseException(
                    'Invalid user ID format',
                    DataBaseErrorCode.INVALID_INPUT
                )
            );

            await expect(userService.delete('a'))
                .rejects
                .toThrow(InvalidUserDataException);
        });

        it('should throw DataBaseException on unknown error', async () => {
            mockUserRepository.delete.mockRejectedValue(
                new Error('Unknown error')
            );
            await expect(userService.delete('1'))
                .rejects
                .toThrow(DataBaseException);
        });
    });
});


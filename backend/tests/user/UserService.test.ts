import { UserServices } from '../../src/users/services/UserServices';
import { UserRepository } from '../../src/users/repository/UserRepository';
import { DataBaseException } from '../../src/shared/exceptions/DataBaseException';
import { DataBaseErrorCode } from '../../src/shared/exceptions/enums/DataBaseErrorCode.enum';
import { EmailAlreadyExistsException } from '../../src/users/exceptions/EmailAlreadyExists.exception';
import { UsernameAlreadyExistsException } from '../../src/users/exceptions/UsernameAlreadyExists.exception';
import { UserNotFoundException } from '../../src/users/exceptions/UserNotFound.exception';

describe('UserService', () => {
  let service: UserServices;
  let repository: jest.Mocked<UserRepository>;
  const newUser = {
    email: 'test@test.com',
    username: 'testuser',
    password: 'password123'
  };

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    } as any;

    service = new UserServices(repository);
  });

  describe('create', () => {
    it('should create user successfully', async () => {
      repository.create.mockResolvedValueOnce({ id: '1', ...newUser });

      const result = await service.create(newUser);
      expect(result).toEqual(expect.objectContaining(newUser));
    });

    it('should throw EmailAlreadyExistsException when email exists', async () => {
      repository.create.mockRejectedValueOnce(
        new DataBaseException(
          'Unique constraint violation',
          DataBaseErrorCode.UNIQUE_VIOLATION,
          {
            constraint: 'users_email_key',
            column: 'email',
            table: 'users'
          }
        )
      );

      await expect(service.create(newUser))
        .rejects
        .toThrow(EmailAlreadyExistsException);
    });

    it('should throw UsernameAlreadyExistsException when username exists', async () => {
      repository.create.mockRejectedValueOnce(
        new DataBaseException(
          'Unique constraint violation',
          DataBaseErrorCode.UNIQUE_VIOLATION,
          {
            constraint: 'users_username_key',
            column: 'username',
            table: 'users'
          }
        )
      );

      await expect(service.create(newUser))
        .rejects
        .toThrow(UsernameAlreadyExistsException);
    });

    it('should throw InternalErrorException for unknown errors', async () => {
      repository.create.mockRejectedValueOnce(
        new DataBaseException(
          'Unknown error',
          DataBaseErrorCode.UNKNOWN_ERROR
        )
      );

      await expect(service.create(newUser))
        .rejects
        .toThrow(DataBaseException);
    });
  });

  describe('findById', () => {
    it('should return user when found', async () => {
      repository.findById.mockResolvedValueOnce({ id: '1', ...newUser });
    });
  });

  it('should throw UserNotFoundException when user not found', async () => {
    repository.findById.mockResolvedValueOnce(null);

    await expect(service.findById('999'))
      .rejects
      .toThrow(UserNotFoundException);
  });

  it('should handle unknown errors', async () => {
    repository.findById.mockRejectedValueOnce(
      new DataBaseException(
        'Unknown error',
        DataBaseErrorCode.UNKNOWN_ERROR
      )
    );

    await expect(service.findById('a'))
      .rejects
      .toThrow(DataBaseException);
  });
}); 
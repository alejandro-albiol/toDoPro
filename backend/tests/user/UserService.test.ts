import { UserService } from '../../src/users/service/UserService.js';
import { UserRepository } from '../../src/users/repository/UserRepository.js';
import { DataBaseException } from '../../src/shared/exceptions/DataBaseException.js';
import { DataBaseErrorCode } from '../../src/shared/exceptions/enums/DataBaseErrorCode.enum.js';
import { EmailAlreadyExistsException } from '../../src/users/exceptions/EmailAlreadyExists.exception.js';
import { UsernameAlreadyExistsException } from '../../src/users/exceptions/UsernameAlreadyExists.exception.js';
import { UserNotFoundException } from '../../src/users/exceptions/UserNotFound.exception.js';
import { HashServices } from '../../src/shared/services/HashServices.js';

describe('UserService', () => {
  let service: UserService;
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

    service = new UserService(repository);
  });

  describe('create', () => {
    it('should create user successfully', async () => {
      const hashedPassword = 'hashed_password_123';
      jest.spyOn(HashServices, 'hashPassword').mockResolvedValue(hashedPassword);

      repository.create.mockResolvedValueOnce({ 
        id: '1',
        email: newUser.email,
        username: newUser.username,
        password: hashedPassword
      });

      const result = await service.create(newUser);
      expect(HashServices.hashPassword).toHaveBeenCalledWith(newUser.password);
      expect(result).toMatchObject({
        id: '1',
        email: newUser.email,
        username: newUser.username,
        password: hashedPassword
      });
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

  describe('update', () => {
    it('should update user successfully', async () => {
      const updateData = {
        id: '1',
        email: 'updated@test.com',
        username: 'updateduser'
      };

      repository.update.mockResolvedValueOnce({
        id: '1',
        email: 'updated@test.com',
        username: 'updateduser',
      });

      const result = await service.update(updateData);

      expect(repository.update).toHaveBeenCalledWith(updateData);
      
      expect(result).toEqual({
        id: '1',
        email: 'updated@test.com',
        username: 'updateduser'
      });
    });

    it('should throw when user not found', async () => {
      repository.update.mockRejectedValueOnce(
        new DataBaseException(
          'User not found',
          DataBaseErrorCode.NOT_FOUND
        )
      );

      await expect(service.update({ id: '999', email: 'test@test.com', username: 'test' }))
        .rejects
        .toThrow(DataBaseException);
    });
  });

  describe('delete', () => {
    it('should delete user successfully', async () => {
      repository.delete.mockResolvedValueOnce(undefined);
      await service.delete('1');
      expect(repository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw UserNotFoundException when user not found', async () => {
      repository.delete.mockRejectedValueOnce(
        new DataBaseException('User not found', DataBaseErrorCode.NOT_FOUND)
      );

      await expect(service.delete('999'))
        .rejects
        .toThrow(UserNotFoundException);
    });
  });
}); 
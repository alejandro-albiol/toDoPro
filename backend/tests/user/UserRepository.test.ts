import { UserRepository } from '../../src/users/repository/UserRepository';
import { DataBaseErrorCode } from '../../src/shared/exceptions/enums/DataBaseErrorCode.enum';
import { mockPool } from '../__mocks__/databaseMock';
import { DataBaseException } from '../../src/shared/exceptions/DataBaseException';
import { IDatabaseError } from '../../src/shared/interfaces/IDataBaseError';

describe('UserRepository', () => {
  let repository: UserRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new UserRepository();
  });

  describe('create', () => {
    const newUser = {
      username: 'testuser',
      email: 'test@test.com',
      password: 'password123'
    };

    it('should create user successfully', async () => {
      mockPool.query.mockResolvedValueOnce({
        rows: [{ id: 1, ...newUser }]
      });

      const result = await repository.create(newUser);
      expect(result).toEqual(expect.objectContaining(newUser));
    });

    it('should throw DatabaseException on unique violation', async () => {
      mockPool.query.mockRejectedValueOnce({
        code: DataBaseErrorCode.UNIQUE_VIOLATION
      });

      await expect(repository.create(newUser))
        .rejects
        .toMatchObject({
          message: 'Unique constraint violation',
          code: DataBaseErrorCode.UNIQUE_VIOLATION
        });
    });

    it('should throw DatabaseException with UNKNOWN_ERROR for unexpected errors', async () => {
      const unexpectedError = new Error('Unexpected error');
      mockPool.query.mockRejectedValueOnce(unexpectedError);

      await expect(repository.create(newUser))
        .rejects
        .toMatchObject({
          code: DataBaseErrorCode.UNKNOWN_ERROR
        });
    });
  });

  describe('findByEmail', () => {
    it('should return user when found', async () => {
      const user = {
        id: 1,
        email: 'test@test.com',
        username: 'test'
      };
      mockPool.query.mockResolvedValueOnce({ rows: [user] });

      const result = await repository.findByEmail('test@test.com');
      expect(result).toEqual(user);
    });

    it('should return null when user not found', async () => {
      mockPool.query.mockResolvedValueOnce({ rows: [] });

      const result = await repository.findByEmail('notfound@test.com');
      expect(result).toBeNull();
    });

    it('should handle database errors', async () => {
      const postgresError = {
        code: DataBaseErrorCode.UNDEFINED_COLUMN,
        detail: 'column "invalid" does not exist'
      };
      mockPool.query.mockRejectedValueOnce(postgresError);

      await expect(repository.findByEmail('test@test.com'))
        .rejects
        .toMatchObject({
          code: DataBaseErrorCode.UNDEFINED_COLUMN,
          message: expect.any(String)
        });
    });
  });

  describe('findById', () => {
    it('should return user when found', async () => {
      const user = {
        id: 1,
        email: 'test@test.com',
        username: 'test'
      };
      mockPool.query.mockResolvedValueOnce({ rows: [user] });

      const result = await repository.findById('1');
      expect(result).toEqual(user);
    });

    it('should return null when user not found', async () => {
      mockPool.query.mockResolvedValueOnce({ rows: [] });

      const result = await repository.findById('1');
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update user successfully', async () => {
      const updatedUser = {
        id: '1',
        email: 'updated@test.com',
        username: 'updated'
      };
      mockPool.query.mockResolvedValueOnce({ rows: [updatedUser] });

      const result = await repository.update(updatedUser);
      expect(result).toEqual(updatedUser);
    });
  });
});

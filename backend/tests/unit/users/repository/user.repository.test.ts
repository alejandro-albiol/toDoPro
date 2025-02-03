import { UserRepository } from '../../../../src/users/repository/user.repository';
import { IDatabasePool } from '../../../../src/shared/models/interfaces/base/i-database-pool';
import { DatabaseErrorHandlerService } from '../../../../src/shared/database/services/database-error-handler.service';
import { CreateUserDTO } from '../../../../src/users/models/dtos/create-user.dto';
import { User } from '../../../../src/users/models/entities/user.entity';
import { PostgresErrorAdapter } from '../../../../src/shared/database/adapters/postgres-error-adapter';
import { UpdateUserDTO } from '../../../../src/users/models/dtos/update-user.dto';


const mockPool: IDatabasePool = {
  query: jest.fn(),
};

class MockDatabaseErrorHandlerService extends DatabaseErrorHandlerService {
  throwAsException = jest.fn((error: any) => { throw error; });
  handle = jest.fn();
}

const mockErrorHandler = new MockDatabaseErrorHandlerService(new PostgresErrorAdapter());

const userRepository = new UserRepository(mockPool, mockErrorHandler);

describe('UserRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new user', async () => {
    const newUser: CreateUserDTO = { username: 'testuser', email: 'test@example.com', password: 'password123' };
    const createdUser: User = { id: '1', ...newUser };
    (mockPool.query as jest.Mock).mockResolvedValueOnce({ rows: [createdUser] });

    const result = await userRepository.create(newUser);
    expect(result).toEqual(createdUser);
    expect(mockPool.query).toHaveBeenCalledWith(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
      [newUser.username, newUser.email, newUser.password]
    );
  });

  it('should handle error on create', async () => {
    const newUser: CreateUserDTO = { username: 'testuser', email: 'test@example.com', password: 'password123' };
    const error = new Error('Database error');
    (mockPool.query as jest.Mock).mockRejectedValueOnce(error);

    await expect(userRepository.create(newUser)).rejects.toThrow(error);
    expect(mockErrorHandler.throwAsException).toHaveBeenCalledWith(error);
  });

  it('should find all users', async () => {
    const users: User[] = [
      { id: '1', username: 'user1', email: 'user1@example.com', password: 'pass1' },
      { id: '2', username: 'user2', email: 'user2@example.com', password: 'pass2' },
    ];
    (mockPool.query as jest.Mock).mockResolvedValueOnce({ rows: users });

    const result = await userRepository.findAll();
    expect(result).toEqual(users);
    expect(mockPool.query).toHaveBeenCalledWith('SELECT * FROM users');
  });

  it('should find user by ID', async () => {
    const user: User = { id: '1', username: 'user1', email: 'user1@example.com', password: 'pass1' };
    (mockPool.query as jest.Mock).mockResolvedValueOnce({ rows: [user] });

    const result = await userRepository.findById('1');
    expect(result).toEqual(user);
    expect(mockPool.query).toHaveBeenCalledWith('SELECT * FROM users WHERE id = $1', ['1']);
  });

  it('should return null if user ID not found', async () => {
    (mockPool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

    const result = await userRepository.findById('nonexistent');
    expect(result).toBeNull();
    expect(mockPool.query).toHaveBeenCalledWith('SELECT * FROM users WHERE id = $1', ['nonexistent']);
  });

  it('should find user by username', async () => {
    const user: User = { id: '1', username: 'user1', email: 'user1@example.com', password: 'pass1' };
    (mockPool.query as jest.Mock).mockResolvedValueOnce({ rows: [user] });

    const result = await userRepository.findByUsername('user1');
    expect(result).toEqual(user);
    expect(mockPool.query).toHaveBeenCalledWith('SELECT * FROM users WHERE username = $1', ['user1']);
  });

  it('should find user by email', async () => {
    const user: User = { id: '1', username: 'user1', email: 'user1@example.com', password: 'pass1' };
    (mockPool.query as jest.Mock).mockResolvedValueOnce({ rows: [user] });

    const result = await userRepository.findByEmail('user1@example.com');
    expect(result).toEqual(user);
    expect(mockPool.query).toHaveBeenCalledWith('SELECT * FROM users WHERE email = $1', ['user1@example.com']);
  });

  it('should update a user', async () => {
    const updateUser: UpdateUserDTO = { id: '1', username: 'username', email: 'email@example.com' };
    (mockPool.query as jest.Mock)
      .mockResolvedValueOnce({ rows: [{ id: '1' }] })
      .mockResolvedValueOnce({ rows: [{ id: '1', username: 'updatedUser', email: 'updated@example.com' }] });

    const result = await userRepository.update(updateUser);
    console.log('Test result:', result);
    expect(result).toEqual({ id: '1', username: 'updatedUser', email: 'updated@example.com' });
    expect(mockPool.query).toHaveBeenNthCalledWith(1, 'SELECT * FROM users WHERE id = $1', ['1']);
    expect(mockPool.query).toHaveBeenNthCalledWith(2, `UPDATE users SET username = $1, email = $2 WHERE id = $3 RETURNING id, username, email`, ['username', 'email@example.com', '1']);
  });

  it('should update user password', async () => {
    const updatedUser: User = { id: '1', username: 'user1', email: 'user1@example.com', password: 'newpass' };
    (mockPool.query as jest.Mock).mockResolvedValueOnce({ rows: [updatedUser] });

    const result = await userRepository.updatePassword('1', 'newpass');
    expect(result).toBeUndefined();
    expect(mockPool.query).toHaveBeenCalledWith(
      'UPDATE users SET password = $1 WHERE id = $2',
      ['newpass', '1']
    );
  });

  it('should delete a user', async () => {
    const deletedUser: User = { id: '1', username: 'user1', email: 'user1@example.com', password: 'pass1' };
    (mockPool.query as jest.Mock).mockResolvedValueOnce({ rowCount: 1 });

    const result = await userRepository.delete('1');
    expect(result).toEqual(true);
    expect(mockPool.query).toHaveBeenCalledWith('DELETE FROM users WHERE id = $1', ['1']);
  });

  it('should return false if user to delete not found', async () => {
    (mockPool.query as jest.Mock).mockResolvedValueOnce({ rowCount: 0 });


    const result = await userRepository.delete('nonexistent');
    expect(result).toBe(false);
    expect(mockPool.query).toHaveBeenCalledWith('DELETE FROM users WHERE id = $1', ['nonexistent']);

  });
}); 
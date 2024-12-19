import { UserRepository } from '../../src/repositories/UserRepository';
import { pool } from '../../src/configuration/configDataBase';
import { UserNotFoundException } from '../../src/models/exceptions/notFound/user/UserNotFoundException';
import { CreateUserDto } from '../../src/interfaces/dtos/user/CreateUserDto';

describe('UserRepository', () => {
  let repository: UserRepository;

  beforeAll(async () => {
    await pool.query(`
      CREATE TEMPORARY TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  });

  beforeEach(() => {
    repository = new UserRepository();
  });

  afterEach(async () => {
    await pool.query('DELETE FROM users');
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('create', () => {
    it('should create a new user successfully', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        email: 'test@test.com',
        password: 'password123'
      };

      const user = await repository.create(createUserDto);
      
      expect(user).toBeDefined();
      expect(user.id).toBeDefined();
      expect(user.username).toBe(createUserDto.username);
      expect(user.email).toBe(createUserDto.email);
      expect(user.password).toBeDefined();
    });
  });

  describe('findById', () => {
    it('should find user by id successfully', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        email: 'test@test.com',
        password: 'password123'
      };
      
      const createdUser = await repository.create(createUserDto);

      const foundUser = await repository.findById(createdUser.id!);
      
      expect(foundUser).toBeDefined();
      expect(foundUser?.id).toBe(createdUser.id);
      expect(foundUser?.username).toBe(createUserDto.username);
      expect(foundUser?.email).toBe(createUserDto.email);
    });

    it('should return undefined when user not found', async () => {
      const foundUser = await repository.findById('999');
      expect(foundUser).toBeUndefined();
    });
  });

  describe('findByEmail', () => {
    it('should find user by email successfully', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        email: 'test@test.com',
        password: 'password123'
      };
      
      const createdUser = await repository.create(createUserDto);
      const foundUser = await repository.findByEmail(createUserDto.email);
      
      expect(foundUser).toBeDefined();
      expect(foundUser?.id).toBe(createdUser.id);
      expect(foundUser?.email).toBe(createUserDto.email);
    });

    it('should return undefined when email not found', async () => {
      const foundUser = await repository.findByEmail('nonexistent@test.com');
      expect(foundUser).toBeUndefined();
    });
  });
}); 
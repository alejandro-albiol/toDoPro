import { UserRepository } from '../../src/repositories/UserRepository.js';
import { pool } from '../../src/configuration/configDataBase.js';
import { User } from '../../src/models/entities/User.js';

describe('UserRepository', () => {
  let repository: UserRepository;

  beforeAll(async () => {
    await pool.query(`
      CREATE TEMPORARY TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL
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
    it('should create a new user', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@test.com',
        password: 'password123'
      };

      const user = await repository.create(userData as User);
      
      expect(user).toHaveProperty('id');
      expect(user.username).toBe(userData.username);
      expect(user.email).toBe(userData.email);
    });
  });

  describe('findById', () => {
    it('should find user by id', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@test.com',
        password: 'password123'
      };
      const createdUser = await repository.create(userData as User);
      
      const foundUser = await repository.findById(createdUser.id!);
      
      expect(foundUser).toBeDefined();
      expect(foundUser?.id).toBe(createdUser.id);
    });
  });
}); 
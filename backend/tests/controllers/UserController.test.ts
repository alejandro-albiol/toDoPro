import request from 'supertest';
import app, { server } from '../../src';
import { pool } from '../../src/configuration/configDataBase';

describe('UserController', () => {
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

  afterEach(async () => {
    await pool.query('DELETE FROM users');
  });

  afterAll(async () => {
    await pool.query('DROP TABLE IF EXISTS users');
    await pool.end();
    await new Promise<void>((resolve) => {
      server.close(() => {
        resolve();
      });
    });
  });

  describe('GET /api/v1/users/:id', () => {
    it('should return a user when exists', async () => {
      // First create a test user
      const testUser = await pool.query(
        'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
        ['testuser', 'test@test.com', 'password123']
      );

      const response = await request(app)
        .get(`/api/v1/users/${testUser.rows[0].id}`)
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('email');
    });

    it('should return 404 when user not found', async () => {
      const response = await request(app)
        .get('/api/v1/users/999')
        .expect(404);

      expect(response.body).toHaveProperty('code', 'USER_NOT_FOUND');
    });
  });
});

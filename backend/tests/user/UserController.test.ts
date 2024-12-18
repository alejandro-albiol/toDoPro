import request from 'supertest';
import app, { server } from '../../src';

describe('UserController', () => {
  describe('GET /api/v1/users/:id', () => {
    it('should return a user when exists', async () => {
      const response = await request(app)
        .get('/api/v1/users/5')
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

afterAll(async () => {
  await new Promise<void>((resolve) => {
    server.close(() => {
      resolve();
    });
  });
});

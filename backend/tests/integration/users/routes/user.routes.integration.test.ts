import request from 'supertest';
import express from 'express';
import { UserRepository } from '../../../../src/users/repository/user.repository';
import { UserService } from '../../../../src/users/service/user.service';
import { UserController } from '../../../../src/users/controller/user.controller';
import { configureUserRoutes } from '../../../../src/users/routes/user.routes';
import { ApiResponse } from '../../../../src/shared/responses/api-response';
import { CreateUserDTO } from '../../../../src/users/models/dtos/create-user.dto';

describe('User Routes', () => {
  let app: express.Application;
  let userRepository: jest.Mocked<UserRepository>;
  let userService: UserService;
  let userController: UserController;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    userRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findByUsername: jest.fn(),
      getPasswordByUsername: jest.fn(),
      updatePassword: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<UserRepository>;

    userService = new UserService(userRepository);
    userController = new UserController(userService);

    jest.spyOn(ApiResponse, 'created').mockImplementation((res, data) => res.status(201).json(data));
    jest.spyOn(ApiResponse, 'success').mockImplementation((res, data) => res.status(200).json(data));
    jest.spyOn(ApiResponse, 'error').mockImplementation((res, error, statusCode) => {
      const err = error as Error;
      return res.status(statusCode || 500).json({ error: err.message });
    });
    jest.spyOn(ApiResponse, 'notFound').mockImplementation((res, message, errorCode) => res.status(404).json({ message, errorCode }));

    app.use('/users', configureUserRoutes(userController));
  });

  describe('POST /users', () => {
    it('should return 201 and the created user', async () => {
      const newUser: CreateUserDTO = { username: 'testuser', email: 'test@example.com', password: 'ValidPassword123' };
      userRepository.create.mockResolvedValue({ id: '1', ...newUser });

      const response = await request(app)
        .post('/users')
        .send(newUser);

      console.log('POST /users response:', response.body);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({ id: '1', ...newUser });
    });

    it('should return 400 for missing password', async () => {
      const newUser: CreateUserDTO = { username: 'testuser', email: 'test@example.com', password: " " };
      const response = await request(app)
        .post('/users')
        .send(newUser);

      console.log('POST /users (missing password) response:', response.body);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Validation failed');
    });
  });

  describe('GET /users/:id', () => {
    it('should return 200 and the user when found', async () => {
      const user = { id: '1', username: 'testuser', email: 'test@example.com' };
      userRepository.findById.mockResolvedValue(user);

      const response = await request(app).get('/users/1');

      console.log('GET /users/1 response:', response.body);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(user);
    });

    it('should return 400 for invalid ID', async () => {
      const response = await request(app).get('/users/invalid-id');

      console.log('GET /users/invalid-id response:', response.body);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Validation failed');
    });
  });

  describe('PUT /users/:id', () => {
    it('should return 200 and the updated user', async () => {
      const updatedUser = { id: '1', username: 'updateduser', email: 'updated@example.com' };
      userRepository.findById.mockResolvedValue({ id: '1', username: 'testuser', email: 'test@example.com' });
      userRepository.update.mockResolvedValue(updatedUser);

      const response = await request(app)
        .put('/users/1')
        .send({ username: 'updateduser', email: 'updated@example.com' });

      console.log('PUT /users/1 response:', response.body);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedUser);
    });

    it('should return 400 for invalid ID', async () => {
      const response = await request(app)
        .put('/users/invalid-id')
        .send({ username: 'updateduser', email: 'updated@example.com' });

      console.log('PUT /users/invalid-id response:', response.body);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Validation failed');
    });
  });

  describe('DELETE /users/:id', () => {
    it('should return 200 when user is deleted', async () => {
      userRepository.findById.mockResolvedValue({ id: '1', username: 'testuser', email: 'test@example.com' });
      userRepository.delete.mockResolvedValue();

      const response = await request(app).delete('/users/1');

      console.log('DELETE /users/1 response:', response.body);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'User deleted successfully' });
    });

    it('should return 400 for invalid ID', async () => {
      const response = await request(app).delete('/users/invalid-id');

      console.log('DELETE /users/invalid-id response:', response.body);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Validation failed');
    });
  });
});
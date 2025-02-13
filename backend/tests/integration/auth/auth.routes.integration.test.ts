import request from 'supertest';
import express from 'express';
import { AuthController } from '../../../src/auth/controller/auth.controller.js';
import { AuthService } from '../../../src/auth/service/auth.service.js';
import { AuthMiddleware } from '../../../src/middlewares/auth.middleware.js';
import { ApiResponse } from '../../../src/shared/responses/api-response.js';
import { configureAuthRoutes } from '../../../src/auth/routes/auth.routes.js';
import { EmailAlreadyExistsException } from '../../../src/users/exceptions/email-already-exists.exception.js';

describe('Auth Routes', () => {
  let app: express.Application;
  let authService: jest.Mocked<AuthService>;
  let authController: AuthController;
  let authMiddleware: jest.Mocked<AuthMiddleware>;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    authService = {
      register: jest.fn(),
      login: jest.fn(),
      changePassword: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    authMiddleware = {
      authenticate: jest.fn((req, res, next) => next()),
    } as unknown as jest.Mocked<AuthMiddleware>;

    authController = new AuthController(authService);

    jest.spyOn(ApiResponse, 'created').mockImplementation((res, data) => res.status(201).json(data));
    jest.spyOn(ApiResponse, 'success').mockImplementation((res, data) => res.status(200).json(data));
    jest.spyOn(ApiResponse, 'error').mockImplementation((res, error, statusCode) => {
      const err = error as Error;
      return res.status(statusCode || 500).json({ error: err.message });
    });
    jest.spyOn(ApiResponse, 'badRequest').mockImplementation((res, message, errorCode) => res.status(400).json({ message, errorCode }));
    jest.spyOn(ApiResponse, 'unauthorized').mockImplementation((res, message, errorCode) => res.status(401).json({ message, errorCode }));

    app.use('/auth', configureAuthRoutes(authController, authMiddleware));
  });

  describe('POST /auth/register', () => {
    it('should return 201 and the created user', async () => {
      const newUser = { username: 'testuser', email: 'test@example.com', password: 'ValidPassword123' };
      authService.register.mockResolvedValue();

      const response = await request(app)
        .post('/auth/register')
        .send(newUser);

      console.log('POST /auth/register response:', response.body);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({ message: 'User registered successfully' });
    });

    it('should return 400 for existing email', async () => {
      const newUser = { username: 'testuser', email: 'test@example.com', password: 'ValidPassword123' };
      authService.register.mockImplementation(() => {
        throw new Error('Email already exists');
      });

      const response = await request(app)
        .post('/auth/register')
        .send(newUser);

      console.log('POST /auth/register (existing email) response:', response.body, response.status);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Email already exists');
    });
  });

  describe('POST /auth/login', () => {
    it('should return 200 and the token', async () => {
      const credentials = { username: 'testuser', password: 'ValidPassword123' };
      authService.login.mockResolvedValue('fake-jwt-token');

      const response = await request(app)
        .post('/auth/login')
        .send(credentials);

      console.log('POST /auth/login response:', response.body);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ token: 'fake-jwt-token' });

      // Log the token for further use
      console.log('Token:', response.body.token);
    });

    it('should return 400 for invalid credentials', async () => {
      const credentials = { username: 'testuser', password: 'InvalidPassword' };
      authService.login.mockImplementation(() => {
        throw new Error('Validation failed');
      });

      const response = await request(app)
        .post('/auth/login')
        .send(credentials);

      console.log('POST /auth/login (invalid credentials) response:', response.body);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Validation failed');
    });
  });

  describe('POST /auth/password/change', () => {
    it('should return 200 when password is changed', async () => {
      const changePasswordDto = { oldPassword: 'OldPassword123', newPassword: 'NewPassword123' };
      authService.changePassword.mockResolvedValue();

      const response = await request(app)
        .post('/auth/password/change')
        .set('Authorization', 'Bearer fake-jwt-token')
        .send(changePasswordDto);

      console.log('POST /auth/password/change response:', response.body);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Password changed successfully' });
    });

    it('should return 401 for invalid token', async () => {
      const changePasswordDto = { oldPassword: 'OldPassword123', newPassword: 'NewPassword123' };
      authMiddleware.authenticate.mockImplementation((req, res, next) => {
        res.status(401).json({ message: 'Invalid token' });
      });

      const response = await request(app)
        .post('/auth/password/change')
        .send(changePasswordDto);

      console.log('POST /auth/password/change (invalid token) response:', response.body);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Invalid token');
    });
  });
});
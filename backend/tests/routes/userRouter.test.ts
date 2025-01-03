import request from 'supertest';
import { app } from '../../src/app';
import { UserController } from '../../src/users/controller/UserController';
import { ApiResponse } from '../../src/shared/models/responses/ApiResponse';

jest.mock('../../src/users/controller/UserController');

describe('UserRouter', () => {
    const mockUser = {
        id: '1',
        email: 'test@test.com',
        name: 'Test User'
    };

    beforeEach(() => {
        // Limpiamos todos los mocks antes de cada test
        jest.clearAllMocks();
    });

    describe('POST /', () => {
        it('should create a user successfully', async () => {
            // Configuramos el mock para simular una creación exitosa
            (UserController.prototype.create as jest.Mock).mockResolvedValue(mockUser);

            const response = await request(app)
                .post('/api/v1/users')
                .send({
                    email: 'test@test.com',
                    password: 'password123',
                    name: 'Test User'
                });

            expect(response.status).toBe(201);
            expect(response.body).toEqual(
                new ApiResponse('success', 'User created successfully', mockUser)
            );
        });

        it('should return 500 when creation fails', async () => {
            const error = new Error('Database error');
            (UserController.prototype.create as jest.Mock).mockRejectedValue(error);

            const response = await request(app)
                .post('/api/v1/users')
                .send({
                    email: 'test@test.com',
                    password: 'password123',
                    name: 'Test User'
                });

            expect(response.status).toBe(500);
            expect(response.body).toEqual({
                status: 'error',
                message: 'Internal server error',
                errors: [{
                    code: 'UNKNOWN_ERROR',
                    message: 'Internal server error'
                }]
            });
        });
    });

    describe('GET /:id', () => {
        it('should get a user by id successfully', async () => {
            (UserController.prototype.findById as jest.Mock).mockResolvedValue(mockUser);

            const response = await request(app).get('/api/v1/users/1');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(
                new ApiResponse('success', 'User found', mockUser)
            );
        });
    });

    describe('PUT /:id', () => {
        it('should update a user successfully', async () => {
            const updatedUser = { ...mockUser, name: 'Updated Name' };
            (UserController.prototype.update as jest.Mock).mockResolvedValue(updatedUser);

            const response = await request(app)
                .put('/api/v1/users/1')
                .send({ name: 'Updated Name' });

            expect(response.status).toBe(200);
            expect(response.body).toEqual(
                new ApiResponse('success', 'User updated successfully', updatedUser)
            );
        });
    });

    describe('PUT /:id/password', () => {
        it('should update password successfully', async () => {
            (UserController.prototype.updatePassword as jest.Mock).mockResolvedValue(undefined);

            const response = await request(app)
                .put('/api/v1/users/1/password')
                .send({ password: 'newPassword123' });

            expect(response.status).toBe(200);
            expect(response.body).toEqual(
                new ApiResponse('success', 'Password updated successfully', null)
            );
        });
    });
});

afterAll(done => {
    done();
});
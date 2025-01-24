import request from 'supertest';
import express from 'express';
import userRouter from '../../src/routes/user-router';
import { UserService } from '../../src/users/service/user-service';
import { mockUser, mockUserInput } from '../__mocks__/user-mock';

const app = express();
app.use(express.json());
app.use('/users', userRouter);

jest.mock('../../src/users/service/user-service');

describe('UserRouter', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /', () => {
        it('should create a user', async () => {
            const spy = jest.spyOn(UserService.prototype, 'create')
                .mockResolvedValueOnce(mockUser);

            const response = await request(app)
                .post('/users')
                .send(mockUserInput);

            expect(response.status).toBe(201);
            expect(spy).toHaveBeenCalledWith(mockUserInput);
            expect(response.body.data).toEqual(mockUser);
        });
    });

    describe('GET /:id', () => {
        it('should get a user by id', async () => {
            const spy = jest.spyOn(UserService.prototype, 'findById')
                .mockResolvedValueOnce(mockUser);

            const response = await request(app)
                .get('/users/1');

            expect(response.status).toBe(200);
            expect(spy).toHaveBeenCalledWith('1');
            expect(response.body.data).toEqual(mockUser);
        });
    });

    describe('PUT /:id', () => {
        it('should update a user', async () => {
            const updatedUser = { ...mockUser, username: 'updatedUsername' };
            const spy = jest.spyOn(UserService.prototype, 'update')
                .mockResolvedValueOnce(updatedUser);

            const response = await request(app)
                .put('/users/1')
                .send({ username: 'updatedUsername' });

            expect(response.status).toBe(200);
            expect(spy).toHaveBeenCalledWith({ id: '1', username: 'updatedusername' });
            expect(response.body.data).toEqual(updatedUser);
        });
    });

    describe('PUT /:id/password', () => {
        it('should update user password', async () => {
            const spy = jest.spyOn(UserService.prototype, 'updatePassword')
                .mockResolvedValueOnce();

            const response = await request(app)
                .put('/users/1/password')
                .send({ password: 'NewPassword123!' });

            expect(response.status).toBe(200);
            expect(spy).toHaveBeenCalledWith('1', 'NewPassword123!');
            expect(response.body.data).toBeNull();
        });
    });

    describe('DELETE /:id', () => {
        it('should delete a user', async () => {
            const spy = jest.spyOn(UserService.prototype, 'delete')
                .mockResolvedValueOnce(null);

            const response = await request(app)
                .delete('/users/1');

            expect(response.status).toBe(200);
            expect(spy).toHaveBeenCalledWith('1');
            expect(response.body.data).toBeNull();
        });
    });

    describe('Validation Middleware', () => {
        it('should return 400 when creating user with invalid data', async () => {
            const response = await request(app)
                .post('/users')
                .send({ 
                    username: 'test',
                    password: 'test'
                });

            expect(response.status).toBe(400);
        });

        it('should return 400 when updating user with invalid id', async () => {
            const response = await request(app)
                .put('/users/invalid-id')
                .send({ username: 'updatedUsername' });

            expect(response.status).toBe(400);
        });

        it('should return 400 when updating password with invalid data', async () => {
            const response = await request(app)
                .put('/users/1/password')
                .send({ password: 'weak' });

            expect(response.status).toBe(400);
        });
    });
});
import request from 'supertest';
import app from '../../../src/app.js';
import { pool } from '../../../src/config/database.config.js';
import { HashService } from '../../../src/shared/services/hash.service.js';
import { JwtService } from '../../../src/auth/service/jwt.service.js';

describe('Authentication Flow', () => {
    let jwtService: JwtService;

    beforeAll(() => {
        jwtService = new JwtService();
    });

    beforeEach(async () => {

        await pool.query('DELETE FROM users');
    });

    describe('Registration and Login Flow', () => {
        const testUser = {
            username: 'testuser',
            email: 'test@example.com',
            password: 'Password123!'
        };

        it('should register a new user and allow login', async () => {

            const registerResponse = await request(app)
                .post('/api/v1/auth/register')
                .send(testUser)
                .expect(201);

            expect(registerResponse.body.success).toBe(true);
            expect(registerResponse.body.data.message).toBe('User registered successfully');

            const loginResponse = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    username: testUser.username,
                    password: testUser.password
                })
                .expect(200);

            expect(loginResponse.body.success).toBe(true);
            expect(loginResponse.body.data.token).toBeDefined();

            // Verify token is valid
            const token = loginResponse.body.data.token;
            const decoded = jwtService.verifyToken(token);
            expect(decoded.username).toBe(testUser.username);
        });

        it('should reject registration with existing username', async () => {
            // 1. Register first user
            await request(app)
                .post('/api/v1/auth/register')
                .send(testUser)
                .expect(201);

            // 2. Try to register with same username
            const response = await request(app)
                .post('/api/v1/auth/register')
                .send({
                    ...testUser,
                    email: 'different@example.com'
                })
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.error.code).toBe('U7'); // USERNAME_ALREADY_EXISTS
        });

        it('should reject registration with existing email', async () => {
            // 1. Register first user
            await request(app)
                .post('/api/v1/auth/register')
                .send(testUser)
                .expect(201);

            // 2. Try to register with same email
            const response = await request(app)
                .post('/api/v1/auth/register')
                .send({
                    ...testUser,
                    username: 'differentuser'
                })
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.error.code).toBe('U6'); // EMAIL_ALREADY_EXISTS
        });

        it('should reject login with invalid credentials', async () => {
            // 1. Register user
            await request(app)
                .post('/api/v1/auth/register')
                .send(testUser)
                .expect(201);

            // 2. Try to login with wrong password
            const response = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    username: testUser.username,
                    password: 'WrongPassword123!'
                })
                .expect(401);

            expect(response.body.success).toBe(false);
            expect(response.body.error.code).toBe('A1'); // INVALID_CREDENTIALS
        });
    });

    describe('Protected Routes', () => {
        let authToken: string;
        const testUser = {
            username: 'protecteduser',
            email: 'protected@example.com',
            password: 'Password123!'
        };

        beforeEach(async () => {
            // Register and login to get token
            await request(app)
                .post('/api/v1/auth/register')
                .send(testUser);

            const loginResponse = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    username: testUser.username,
                    password: testUser.password
                });

            authToken = loginResponse.body.data.token;
        });

        it('should allow access to protected routes with valid token', async () => {
            const response = await request(app)
                .post('/api/v1/auth/password/change')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    oldPassword: testUser.password,
                    newPassword: 'NewPassword123!'
                })
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.message).toBe('Password changed successfully');
        });

        it('should reject access to protected routes without token', async () => {
            const response = await request(app)
                .post('/api/v1/auth/password/change')
                .send({
                    oldPassword: testUser.password,
                    newPassword: 'NewPassword123!'
                })
                .expect(401);

            expect(response.body.success).toBe(false);
            expect(response.body.error.code).toBe('A2'); // INVALID_TOKEN
        });

        it('should reject access with invalid token', async () => {
            const response = await request(app)
                .post('/api/v1/auth/password/change')
                .set('Authorization', 'Bearer invalid.token.here')
                .send({
                    oldPassword: testUser.password,
                    newPassword: 'NewPassword123!'
                })
                .expect(401);

            expect(response.body.success).toBe(false);
            expect(response.body.error.code).toBe('A2'); // INVALID_TOKEN
        });
    });

    describe('Password Management', () => {
        let authToken: string;
        const testUser = {
            username: 'passworduser',
            email: 'password@example.com',
            password: 'Password123!'
        };

        beforeEach(async () => {
            // Register and login to get token
            await request(app)
                .post('/api/v1/auth/register')
                .send(testUser);

            const loginResponse = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    username: testUser.username,
                    password: testUser.password
                });

            authToken = loginResponse.body.data.token;
        });

        it('should change password successfully', async () => {
            // 1. Change password
            await request(app)
                .post('/api/v1/auth/password/change')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    oldPassword: testUser.password,
                    newPassword: 'NewPassword123!'
                })
                .expect(200);

            // 2. Try to login with new password
            const loginResponse = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    username: testUser.username,
                    password: 'NewPassword123!'
                })
                .expect(200);

            expect(loginResponse.body.success).toBe(true);
            expect(loginResponse.body.data.token).toBeDefined();
        });

        it('should reject password change with incorrect old password', async () => {
            const response = await request(app)
                .post('/api/v1/auth/password/change')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    oldPassword: 'WrongPassword123!',
                    newPassword: 'NewPassword123!'
                })
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.error.code).toBe('A1'); // INVALID_CREDENTIALS
        });

        it('should reject password change with invalid new password format', async () => {
            const response = await request(app)
                .post('/api/v1/auth/password/change')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    oldPassword: testUser.password,
                    newPassword: 'weak'
                })
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.error.code).toBe('U3'); // INVALID_PASSWORD
        });
    });

    describe('Input Validation', () => {
        it('should validate registration input', async () => {
            const invalidUsers = [
                {
                    // Missing username
                    email: 'test@example.com',
                    password: 'Password123!'
                },
                {
                    // Invalid email
                    username: 'testuser',
                    email: 'invalid-email',
                    password: 'Password123!'
                },
                {
                    // Weak password
                    username: 'testuser',
                    email: 'test@example.com',
                    password: 'weak'
                }
            ];

            for (const invalidUser of invalidUsers) {
                const response = await request(app)
                    .post('/api/v1/auth/register')
                    .send(invalidUser)
                    .expect(400);

                expect(response.body.success).toBe(false);
            }
        });

        it('should validate login input', async () => {
            const invalidLogins = [
                {
                    // Missing username
                    password: 'Password123!'
                },
                {
                    // Missing password
                    username: 'testuser'
                },
                {
                    // Both empty
                    username: '',
                    password: ''
                }
            ];

            for (const invalidLogin of invalidLogins) {
                const response = await request(app)
                    .post('/api/v1/auth/login')
                    .send(invalidLogin)
                    .expect(400);

                expect(response.body.success).toBe(false);
            }
        });
    });
}); 
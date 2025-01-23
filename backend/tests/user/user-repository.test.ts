import { UserRepository } from "../../src/users/repository/user-repository.js";
import { DataBaseErrorCode } from "../../src/shared/exceptions/enums/data-base-error-code.enum.js";
import { DataBaseException } from "../../src/shared/exceptions/data-base.exception.js";
import { mockPool } from "../__mocks__/database-mock.js";

describe('UserRepository', () => {
    let userRepository: UserRepository;
    const mockUser = {
        id: '1',
        username: 'testuser',
        email: 'test@test.com',
        password: 'hashedPassword123',
        created_at: new Date(),
        updated_at: new Date()
    };

    beforeEach(() => {
        userRepository = new UserRepository();
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create user successfully', async () => {
            mockPool.query.mockResolvedValueOnce({ rows: [mockUser] });

            const result = await userRepository.create({
                username: 'testuser',
                email: 'test@test.com',
                password: 'password123'
            });

            expect(result).toEqual(mockUser);
        });

        it('should throw DataBaseException when email already exists', async () => {
            mockPool.query.mockRejectedValueOnce({
                code: DataBaseErrorCode.UNIQUE_VIOLATION,
                constraint: 'users_email_key'
            });

            await expect(userRepository.create({
                username: 'testuser',
                email: 'existing@test.com',
                password: 'password123'
            })).rejects.toThrow(DataBaseException);
        });

        it('should throw DataBaseException when username already exists', async () => {
            mockPool.query.mockRejectedValueOnce({
                code: DataBaseErrorCode.UNIQUE_VIOLATION,
                constraint: 'users_username_key'
            });

            await expect(userRepository.create({
                username: 'existinguser',
                email: 'test@test.com',
                password: 'password123'
            })).rejects.toThrow(DataBaseException);
        });
    });

    describe('findById', () => {
        it('should find user by id', async () => {
            mockPool.query.mockResolvedValueOnce({ rows: [mockUser] });

            const result = await userRepository.findById('1');

            expect(result).toEqual(mockUser);
        });

        it('should return null when user not found', async () => {
            mockPool.query.mockResolvedValueOnce({ rows: [] });

            const result = await userRepository.findById('999');

            expect(result).toBeNull();
        });

        it('should throw DataBaseException when id format is invalid', async () => {
            mockPool.query.mockRejectedValueOnce({
                code: DataBaseErrorCode.INVALID_INPUT
            });

            await expect(userRepository.findById('invalid-id'))
                .rejects.toThrow(DataBaseException);
        });
    });

    describe('findByEmail', () => {
        it('should find user by email', async () => {
            mockPool.query.mockResolvedValueOnce({ rows: [mockUser] });

            const result = await userRepository.findByEmail('test@test.com');

            expect(result).toEqual(mockUser);
        });

        it('should return null when email not found', async () => {
            mockPool.query.mockResolvedValueOnce({ rows: [] });

            const result = await userRepository.findByEmail('notfound@test.com');

            expect(result).toBeNull();
        });
    });

    describe('findByUsername', () => {
        it('should find user by username', async () => {
            mockPool.query.mockResolvedValueOnce({ rows: [mockUser] });

            const result = await userRepository.findByUsername('testuser');

            expect(result).toEqual(mockUser);
        });

        it('should return null when username not found', async () => {
            mockPool.query.mockResolvedValueOnce({ rows: [] });

            const result = await userRepository.findByUsername('nonexistent');

            expect(result).toBeNull();
        });
    });
}); 
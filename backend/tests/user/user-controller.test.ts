import { UserController } from "../../src/users/controller/user.controller.js";
import { UserNotFoundException } from "../../src/users/exceptions/user-not-found.exception.js";
import { EmailAlreadyExistsException } from "../../src/users/exceptions/email-already-exists.exception.js";
import { UsernameAlreadyExistsException } from "../../src/users/exceptions/username-already-exists.exception.js";
import { UserCreationFailedException } from "../../src/users/exceptions/user-creation-failed.exception.js";

describe('UserController', () => {
    let userController: UserController;
    let mockUserService: any;

    const mockUser = {
        id: '1',
        username: 'testuser',
        email: 'test@test.com',
        password: 'hashedPassword123',
        created_at: new Date(),
        updated_at: new Date()
    };

    beforeEach(() => {
        mockUserService = {
            create: jest.fn(),
            findById: jest.fn(),
            findByEmail: jest.fn(),
            update: jest.fn(),
            updatePassword: jest.fn(),
            delete: jest.fn()
        };
        userController = new UserController(mockUserService);
    });

    describe('create', () => {
        it('should create user successfully', async () => {
            mockUserService.create.mockResolvedValue(mockUser);

            const result = await userController.create({
                username: 'testuser',
                email: 'test@test.com',
                password: 'password123'
            });

            expect(result).toEqual(mockUser);
            expect(mockUserService.create).toHaveBeenCalledWith({
                username: 'testuser',
                email: 'test@test.com',
                password: 'password123'
            });
        });

        it('should pass through EmailAlreadyExistsException from service', async () => {
            mockUserService.create.mockRejectedValue(
                new EmailAlreadyExistsException('test@test.com')
            );

            await expect(userController.create({
                username: 'testuser',
                email: 'test@test.com',
                password: 'password123'
            })).rejects.toThrow(EmailAlreadyExistsException);
        });

        it('should pass through UsernameAlreadyExistsException from service', async () => {
            mockUserService.create.mockRejectedValue(
                new UsernameAlreadyExistsException('testuser')
            );

            await expect(userController.create({
                username: 'testuser',
                email: 'test@test.com',
                password: 'password123'
            })).rejects.toThrow(UsernameAlreadyExistsException);
        });

        it('should pass through UserCreationFailedException from service', async () => {
            mockUserService.create.mockRejectedValue(
                new UserCreationFailedException('Failed to create user')
            );

            await expect(userController.create({
                username: 'testuser',
                email: 'test@test.com',
                password: 'password123'
            })).rejects.toThrow(UserCreationFailedException);
        });
    });

    describe('findById', () => {
        it('should find user by id', async () => {
            mockUserService.findById.mockResolvedValue(mockUser);

            const result = await userController.findById('1');

            expect(result).toEqual(mockUser);
            expect(mockUserService.findById).toHaveBeenCalledWith('1');
        });

        it('should pass through UserNotFoundException from service', async () => {
            mockUserService.findById.mockRejectedValue(
                new UserNotFoundException('999')
            );

            await expect(userController.findById('999'))
                .rejects.toThrow(UserNotFoundException);
        });
    });

    describe('updatePassword', () => {
        it('should update password successfully', async () => {
            mockUserService.updatePassword.mockResolvedValue(undefined);

            await expect(userController.updatePassword('1', 'newPassword123')).resolves.not.toThrow();

            expect(mockUserService.updatePassword).toHaveBeenCalledWith(
                '1',
                'newPassword123'
            );
        });

        it('should pass through UserNotFoundException from service', async () => {
            mockUserService.updatePassword.mockRejectedValue(
                new UserNotFoundException('999')
            );

            await expect(userController.updatePassword('999', 'newPassword123')).rejects.toThrow(UserNotFoundException);
        });
    });
}); 
import { UserService } from '../../../../src/users/service/user.service.js';
import { IUserRepository } from '../../../../src/users/repository/i-user.repository.js';
import { User } from '../../../../src/users/models/entities/user.entity.js';
import { EmailAlreadyExistsException } from '../../../../src/users/exceptions/email-already-exists.exception.js';
import { UsernameAlreadyExistsException } from '../../../../src/users/exceptions/username-already-exists.exception.js';
import { UserCreationFailedException } from '../../../../src/users/exceptions/user-creation-failed.exception.js';
import { IGenericDatabaseError } from '../../../../src/shared/models/interfaces/base/i-database-error.js';
import { DbErrorCode } from '../../../../src/shared/models/constants/db-error-code.enum.js';

describe('UserService', () => {
    let service: UserService;
    let mockRepository: jest.Mocked<IUserRepository>;

    beforeEach(() => {
        mockRepository = {
            create: jest.fn(),
            findByEmail: jest.fn(),
            findByUsername: jest.fn()
        } as any;
        service = new UserService(mockRepository);
    });

    describe('create', () => {
        const mockUser: User = {
            id: '123',
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123'
        };

        it('should create a user when email and username are unique', async () => {
            mockRepository.findByEmail.mockResolvedValueOnce(null);
            mockRepository.findByUsername.mockResolvedValueOnce(null);
            mockRepository.create.mockResolvedValueOnce(mockUser);

            const result = await service.create(mockUser);

            expect(result).toEqual(mockUser);
            expect(mockRepository.findByEmail).toHaveBeenCalledWith(mockUser.email);
            expect(mockRepository.findByUsername).toHaveBeenCalledWith(mockUser.username);
            expect(mockRepository.create).toHaveBeenCalledWith(mockUser);
        });

        it('should throw EmailAlreadyExistsException when email exists', async () => {
            mockRepository.findByEmail.mockResolvedValueOnce(mockUser);

            await expect(service.create(mockUser))
                .rejects
                .toThrow(EmailAlreadyExistsException);
        });

        it('should throw UsernameAlreadyExistsException when username exists', async () => {
            mockRepository.findByEmail.mockResolvedValueOnce(null);
            mockRepository.findByUsername.mockResolvedValueOnce(mockUser);

            await expect(service.create(mockUser))
                .rejects
                .toThrow(UsernameAlreadyExistsException);
        });

        it('should handle database unique violation errors', async () => {
            mockRepository.findByEmail.mockResolvedValueOnce(null);
            mockRepository.findByUsername.mockResolvedValueOnce(null);

            const dbError: IGenericDatabaseError = {
                code: DbErrorCode.UNIQUE_VIOLATION,
                message: 'Unique violation',
                metadata: {
                    constraint: 'users_email_key'
                }
            };
            mockRepository.create.mockRejectedValueOnce(dbError);

            await expect(service.create(mockUser))
                .rejects
                .toThrow(EmailAlreadyExistsException);
        });

        it('should handle unknown errors', async () => {
            mockRepository.findByEmail.mockResolvedValueOnce(null);
            mockRepository.findByUsername.mockResolvedValueOnce(null);
            mockRepository.create.mockRejectedValueOnce(new Error('Unknown error'));

            await expect(service.create(mockUser))
                .rejects
                .toThrow(UserCreationFailedException);
        });
    });
});

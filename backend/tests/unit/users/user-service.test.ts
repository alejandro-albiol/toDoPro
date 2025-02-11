import { UserService } from '../../../src/users/service/user.service'
import { IUserRepository } from '../../../src/users/repository/i-user.repository'
import { CreateUserDTO } from '../../../src/users/models/dtos/create-user.dto';
import { User } from '../../../src/users/models/entities/user.entity';
import { UniqueViolationException } from '../../../src/shared/exceptions/database/unique-violation.exception';
import { UsernameAlreadyExistsException } from '../../../src/users/exceptions/username-already-exists.exception';
import { EmailAlreadyExistsException } from '../../../src/users/exceptions/email-already-exists.exception';
import { UserCreationFailedException } from '../../../src/users/exceptions/user-creation-failed.exception';
import { InvalidUserDataException } from '../../../src/users/exceptions/invalid-user-data.exception';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
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
    } as unknown as jest.Mocked<IUserRepository>;

    userService = new UserService(userRepository);
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      const dto: CreateUserDTO = { username: 'testuser', email: 'test@example.com', password: 'password' };
      const user: Partial<User> = { id: '1', username: 'testuser', email: 'test@example.com' };

      userRepository.create.mockResolvedValue(user);

      const result = await userService.create(dto);

      expect(result).toEqual(user);
      expect(userRepository.create).toHaveBeenCalledWith(expect.objectContaining({ username: 'testuser', email: 'test@example.com' }));
    });

    it('should throw UsernameAlreadyExistsException', async () => {
      const dto: CreateUserDTO = { username: 'testuser', email: 'test@example.com', password: 'password' };

      userRepository.create.mockRejectedValue(new UniqueViolationException('username'));

      await expect(userService.create(dto)).rejects.toThrow(UsernameAlreadyExistsException);
    });

    it('should throw EmailAlreadyExistsException', async () => {
      const dto: CreateUserDTO = { username: 'testuser', email: 'test@example.com', password: 'password' };

      userRepository.create.mockRejectedValue(new UniqueViolationException('email'));

      await expect(userService.create(dto)).rejects.toThrow(EmailAlreadyExistsException);
    });

    it('should throw UserCreationFailedException', async () => {
      const dto: CreateUserDTO = { username: 'testuser', email: 'test@example.com', password: 'password' };

      userRepository.create.mockRejectedValue(new Error('Unknown error'));

      await expect(userService.create(dto)).rejects.toThrow(UserCreationFailedException);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users: User[] = [{ id: '1', username: 'testuser', email: 'test@example.com', password: 'hashedpassword' }];

      userRepository.findAll.mockResolvedValue(users);

      const result = await userService.findAll();

      expect(result).toEqual([{ id: '1', username: 'testuser', email: 'test@example.com' }]);
    });

    it('should throw InvalidUserDataException', async () => {
      userRepository.findAll.mockRejectedValue(new Error('Unknown error'));

      await expect(userService.findAll()).rejects.toThrow(InvalidUserDataException);
    });
  });
});

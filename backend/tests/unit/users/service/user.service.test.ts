import { UserService } from '../../../../src/users/service/user.service';
import { IUserRepository } from '../../../../src/users/repository/i-user.repository';
import { CreateUserDTO } from '../../../../src/users/models/dtos/create-user.dto';
import { UpdateUserDTO } from '../../../../src/users/models/dtos/update-user.dto';
import { User } from '../../../../src/users/models/entities/user.entity';
import { UniqueViolationException } from '../../../../src/shared/exceptions/database/unique-violation.exception';
import { UsernameAlreadyExistsException } from '../../../../src/users/exceptions/username-already-exists.exception';
import { EmailAlreadyExistsException } from '../../../../src/users/exceptions/email-already-exists.exception';
import { UserCreationFailedException } from '../../../../src/users/exceptions/user-creation-failed.exception';
import { InvalidUserDataException } from '../../../../src/users/exceptions/invalid-user-data.exception';
import { UserNotFoundException } from '../../../../src/users/exceptions/user-not-found.exception';
import { HashService } from '../../../../src/shared/services/hash.service';

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
jest.spyOn(HashService, 'hashPassword').mockImplementation(jest.fn());
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      const dto: CreateUserDTO = { username: 'testuser', email: 'test@example.com', password: 'password' };
      const user: Partial<User> = { id: '1', username: 'testuser', email: 'test@example.com' };

      userRepository.create.mockResolvedValue(user);
      (HashService.hashPassword as jest.Mock).mockResolvedValue('hashedpassword');

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

  describe('findById', () => {
    it('should find a user by id successfully', async () => {
      const user: Partial<User> = { id: '1', username: 'testuser', email: 'test@example.com' };
      userRepository.findById.mockResolvedValue(user);

      const result = await userService.findById('1');

      expect(result).toEqual(user);
      expect(userRepository.findById).toHaveBeenCalledWith('1');
    });

    it('should handle errors when finding a user by id', async () => {
      userRepository.findById.mockRejectedValue(new Error('Unknown error'));

      await expect(userService.findById('1')).rejects.toThrow(InvalidUserDataException);
    });
  });

  describe('findByUsername', () => {
    it('should find a user by username successfully', async () => {
      const user: Partial<User> = { id: '1', username: 'testuser', email: 'test@mail.com' };
      userRepository.findByUsername.mockResolvedValue(user);

      const result = await userService.findByUsername('testuser');
      expect(result).toEqual(user);
      expect(userRepository.findByUsername).toHaveBeenCalledWith('testuser');
    });
  });

  describe('findByEmail', () => {
    it('should find a user by email successfully', async () => {
      const user: Partial<User> = { id: '1', username: 'testuser', email: 'user@mail.com' };
      userRepository.findByEmail.mockResolvedValue(user);

      const result = await userService.findByEmail('user@mail.com');

      expect(result).toEqual(user);
      expect(userRepository.findByEmail).toHaveBeenCalledWith('user@mail.com');
    });

    it('should handle errors when finding a user by email', async () => {
      userRepository.findByEmail.mockRejectedValue(new Error('Unknown error'));

      await expect(userService.findByEmail('user@mail.com')).rejects.toThrow(InvalidUserDataException);
    });
  });

  describe('updatePassword', () => {
    it('should update the user password successfully', async () => {
      const user: Partial<User> = { id: '1', username: 'testuser', email: 'test@example.com'};
      userRepository.findById.mockResolvedValueOnce(user);
      (HashService.hashPassword as jest.Mock).mockResolvedValueOnce('hashedpassword');

      await userService.updatePassword('1', 'newpassword123');

      expect(userRepository.findById).toHaveBeenCalledWith('1');
      expect(HashService.hashPassword).toHaveBeenCalledWith('newpassword123');
      expect(userRepository.updatePassword).toHaveBeenCalledWith('1', 'hashedpassword');
    });

    it('should throw UserNotFoundException if user not found', async () => {
      userRepository.findById.mockResolvedValueOnce(null);
      await expect(userService.updatePassword('99', 'newpassword123')).rejects.toThrow(UserNotFoundException);
      expect(userRepository.updatePassword).not.toHaveBeenCalled();
    });

    it('should throw InvalidUserDataException on error', async () => {
      userRepository.findById.mockRejectedValue(new Error('Unknown error'));

      await expect(userService.updatePassword('1', 'newpassword123')).rejects.toThrow(InvalidUserDataException);
    });
  });

  describe('update', () => {
    it('should update a user successfully', async () => {
      const user: Partial<User> = { id: '1', username: 'testuser', email: 'test@example.com' };
      const updateDto: UpdateUserDTO = { id: '1', username: 'updateduser', email: 'updated@example.com' };
      const newUser: Partial<User> = { id: '1', username: 'updateduser', email: 'updated@example.com' };
      userRepository.findById.mockResolvedValue(user);
      userRepository.update.mockResolvedValue(newUser);

      const result = await userService.update(updateDto);

      expect(result).toEqual(newUser);
      expect(userRepository.findById).toHaveBeenCalledWith('1');
      expect(userRepository.update).toHaveBeenCalledWith(updateDto);
    });

    it('should throw UserNotFoundException if user not found', async () => {
      const updateDto: UpdateUserDTO = { id: '1', username: 'updateduser', email: 'updated@example.com' };
      userRepository.findById.mockResolvedValue(null);

      await expect(userService.update(updateDto)).rejects.toThrow(UserNotFoundException);
    });

    it('should throw InvalidUserDataException on error', async () => {
      const updateDto: UpdateUserDTO = { id: '1', username: 'updateduser', email: 'updated@example.com' };
      userRepository.findById.mockRejectedValue(new Error('Unknown error'));

      await expect(userService.update(updateDto)).rejects.toThrow(InvalidUserDataException);
    });
  });

  describe('delete', () => {
    it('should delete a user successfully', async () => {
      const user: Partial<User> = { id: '1', username: 'testuser', email: 'test@example.com' };
      userRepository.findById.mockResolvedValue(user);

      const result = await userService.delete('1');

      expect(result).toBe(undefined);
      expect(userRepository.findById).toHaveBeenCalledWith('1');
      expect(userRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw UserNotFoundException if user not found', async () => {
      userRepository.findById.mockResolvedValue(null);

      await expect(userService.delete('1')).rejects.toThrow(UserNotFoundException);
    });

    it('should throw InvalidUserDataException on error', async () => {
      userRepository.findById.mockRejectedValue(new Error('Unknown error'));

      await expect(userService.delete('1')).rejects.toThrow(InvalidUserDataException);
    });
  });
});

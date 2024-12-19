import { UserServices } from '../../src/services/UserServices.js';
import { UserRepository } from '../../src/repositories/UserRepository.js';
import { CreateUserDTO } from '../../src/models/dtos/UserDTO.js';
import { EmailConflictException } from '../../src/models/exceptions/conflict/user/EmailConflictException.js';

jest.mock('../../src/repositories/UserRepository.js');

describe('UserService', () => {
  let service: UserServices;
  let mockRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockRepository = new UserRepository() as jest.Mocked<UserRepository>;
    service = new UserServices(mockRepository);
  });

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      const userData: CreateUserDTO = {
        username: 'testuser',
        email: 'test@test.com',
        password: 'password123'
      };

      const expectedUser = {
        id: '1',
        username: userData.username,
        email: userData.email
      };

      mockRepository.create.mockResolvedValue(expectedUser);

      const result = await service.create(userData);

      expect(result).toEqual(expectedUser);
      expect(mockRepository.create).toHaveBeenCalledWith(expect.any(Object));
    });

    it('should throw when creating user with duplicate email', async () => {
      const createUserDto: CreateUserDTO = {
        username: 'testuser',
        email: 'test@test.com',
        password: 'password123'
      };
      
      mockRepository.findByEmail.mockResolvedValueOnce({
        id: '1',
        ...createUserDto
      });

      await expect(service.create(createUserDto))
        .rejects
        .toThrow(EmailConflictException);
    });
  });
});
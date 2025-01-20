import { HashServices } from "../../src/shared/services/HashServices.js";
import { UserController } from "../../src/users/controller/UserController.js";
import { UserRepository } from "../../src/users/repository/UserRepository.js";
import { UserService } from "../../src/users/service/UserService.js";
import { IUserService } from "../../src/users/service/IUserService.js";
import { DataBaseException } from "../../src/shared/exceptions/DataBaseException.js";
import { DataBaseErrorCode } from "../../src/shared/exceptions/enums/DataBaseErrorCode.enum.js";

const mockUserService = new UserService(new UserRepository());
const mockUserController = new UserController(mockUserService);

describe('UserController', () => {
  let controller: UserController;
  let mockUserService: jest.Mocked<IUserService>;

  beforeEach(() => {
    mockUserService = {
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    } as any;

    controller = new UserController(mockUserService);
  });

  describe('create', () => {
    it('should create user successfully', async () => {
      const userDto = {
        email: 'test@test.com',
        username: 'test',
        password: 'test'
      };

      const hashedPassword = await HashServices.hashPassword(userDto.password);

      const expectedUser = {
        id: '1',
        ...userDto,
        password: hashedPassword
      };

      mockUserService.create.mockResolvedValueOnce(expectedUser);

      const result = await controller.create(userDto);
      expect(result).toEqual(expectedUser);
    });

    it('should handle database errors', async () => {
      mockUserService.create.mockRejectedValueOnce(
        new DataBaseException('Error creating user', DataBaseErrorCode.UNKNOWN_ERROR)
      );

      await expect(controller.create({
        email: 'test@test.com',
        username: 'test',
        password: 'test'
      })).rejects.toThrow(DataBaseException);
    });
  });
});


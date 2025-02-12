import { Request, Response } from 'express';
import { UserController } from '../../../../src/users/controller/user.controller';
import { IUserService } from '../../../../src/users/service/i-user.service';
import { CreateUserDTO } from '../../../../src/users/models/dtos/create-user.dto';
import { UpdateUserDTO } from '../../../../src/users/models/dtos/update-user.dto';
import { ApiResponse } from '../../../../src/shared/responses/api-response';
import { UserCreationFailedException } from '../../../../src/users/exceptions/user-creation-failed.exception';
import { User } from '../../../../src/users/models/entities/user.entity';
import { InvalidUserDataException } from '../../../../src/users/exceptions/invalid-user-data.exception';
import { UserErrorCodes } from '../../../../src/users/exceptions/enums/user-error-codes.enum';

jest.mock('../../../../src/shared/responses/api-response');

describe('UserController', () => {
  let userController: UserController;
  let userService: jest.Mocked<IUserService>;
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    userService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      updatePassword: jest.fn(),
      delete: jest.fn(),
      findByEmail: jest.fn(),
      findByUsername: jest.fn(),
      getPasswordByUsername: jest.fn(),
    } as jest.Mocked<IUserService>;

    userController = new UserController(userService);
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const dto: CreateUserDTO = { username: 'testuser', email: 'test@example.com', password: 'password123' };
      req.body = dto;
      userService.create.mockResolvedValue(dto);

      await userController.create(req as Request, res as Response);

      expect(userService.create).toHaveBeenCalledWith(dto);
      expect(ApiResponse.created).toHaveBeenCalledWith(res, dto);
    });

    it('should handle errors', async () => {
      const error = new UserCreationFailedException('Error creating user');
      userService.create.mockRejectedValue(error);

      await userController.create(req as Request, res as Response);

      expect(ApiResponse.error).toHaveBeenCalledWith(res, error, 400);
    });
  });

  describe('findAll', () => {
    it('should retrieve all users', async () => {
      const users = [
        { id: '1', username: 'testuser', email: 'test@example.com', password: 'hashedPassword123' },
        { id: '2', username: 'anotheruser', email: 'another@example.com', password: 'hashedPassword456' }
      ];
      userService.findAll.mockResolvedValue(users);

      await userController.findAll(req as Request, res as Response);

      expect(userService.findAll).toHaveBeenCalled();
      expect(ApiResponse.success).toHaveBeenCalledWith(res, users);
    });

    it('should handle errors', async () => {
      const error = new Error('Error retrieving users');
      userService.findAll.mockRejectedValue(error);

      await userController.findAll(req as Request, res as Response);

      expect(ApiResponse.error).toHaveBeenCalledWith(res, error);
    });
  });

  describe('findById', () => {
    it('should retrieve a user by id', async () => {
      const user = { id: '1', username: 'testuser', email: 'test@example.com' };
      req.params = { id: '1' };
      userService.findById.mockResolvedValue(user);

      await userController.findById(req as Request, res as Response);

      expect(userService.findById).toHaveBeenCalledWith('1');
      expect(ApiResponse.success).toHaveBeenCalledWith(res, user);
    });

    it('should handle user not found', async () => {
      req.params = { id: '1' };
      userService.findById.mockResolvedValue(null);

      await userController.findById(req as Request, res as Response);

      expect(ApiResponse.notFound).toHaveBeenCalledWith(res, 'User with id 1 not found', UserErrorCodes.USER_NOT_FOUND);
    });

    it('should handle errors', async () => {
      const error = new Error('Error retrieving user');
      req.params = { id: '1' };
      userService.findById.mockRejectedValue(error);

      await userController.findById(req as Request, res as Response);

      expect(ApiResponse.error).toHaveBeenCalledWith(res, error);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateDto: UpdateUserDTO = { id: '1', username: 'updateduser', email: 'updated@example.com' };
      req.params = { id: '1' };
      req.body = { username: 'updateduser', email: 'updated@example.com' };
      const newUserUpdated: Partial<User> = { id: '1', username: 'updateduser', email: 'updated@example.com' };
      userService.update.mockResolvedValue(newUserUpdated);

      await userController.update(req as Request, res as Response);

      expect(userService.update).toHaveBeenCalledWith(updateDto);
      expect(ApiResponse.success).toHaveBeenCalledWith(res, updateDto);
    });

    it('should handle errors', async () => {
      const error = new InvalidUserDataException('Error updating user');
      req.params = { id: '1' };
      req.body = { username: 'updateduser', email: 'updated@example.com' };
      userService.update.mockRejectedValue(error);

      await userController.update(req as Request, res as Response);

      expect(ApiResponse.error).toHaveBeenCalledWith(res, error, 400);
    });
    
    it('should update only allowed fields', async () => {
      const updateDto: UpdateUserDTO = { id: '1', username: 'updateduser' };
      req.params = { id: '1' };
      req.body = { username: 'updateduser' };
      const newUserUpdated: Partial<User> = { id: '1', username: 'updateduser' };
      userService.update.mockResolvedValue(newUserUpdated);

      await userController.update(req as Request, res as Response);

      expect(userService.update).toHaveBeenCalledWith(updateDto);
      expect(ApiResponse.success).toHaveBeenCalledWith(res, newUserUpdated);
    });
  });

  describe('updatePassword', () => {
    it('should update the user password', async () => {
      req.params = { id: '1' };
      req.body = { password: 'newpassword123' };

      await userController.updatePassword(req as Request, res as Response);

      expect(userService.updatePassword).toHaveBeenCalledWith('1', 'newpassword123');
      expect(ApiResponse.success).toHaveBeenCalledWith(res, { message: 'Password updated successfully' });
    });

    it('should handle errors', async () => {
      const error = new InvalidUserDataException('Error updating password');
      req.params = { id: '1' };
      req.body = { password: 'newpassword123' };
      userService.updatePassword.mockRejectedValue(error);

      await userController.updatePassword(req as Request, res as Response);

      expect(ApiResponse.error).toHaveBeenCalledWith(res, error, 400);
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      req.params = { id: '1' };
      userService.delete.mockResolvedValue();

      await userController.delete(req as Request, res as Response);

      expect(userService.delete).toHaveBeenCalledWith('1');
      expect(ApiResponse.success).toHaveBeenCalledWith(res, { message: 'User deleted successfully' });
    });

    it('should handle user not found', async () => {
      req.params = { id: '1' };
      userService.delete.mockResolvedValue();

      await userController.delete(req as Request, res as Response);
// Error is here, response match but jest not accept it
      expect(ApiResponse.notFound).toHaveBeenCalledWith(res, 'User with id 1 not found', UserErrorCodes.USER_NOT_FOUND);
    });

    it('should handle errors', async () => {
      const error = new Error('Error deleting user');
      req.params = { id: '1' };
      userService.delete.mockRejectedValue(error);

      await userController.delete(req as Request, res as Response);

      expect(ApiResponse.error).toHaveBeenCalledWith(res, error);
    });
  });
});
import {
  SingleUserResult,
  UserListResult,
  NoDataResult,
} from '../models/responses/ProcessResult.js';
import {
  CreateUserDTO,
  UpdateUserDTO,
  ChangePasswordDTO,
  LoginDTO,
} from '../models/dtos/UserDTO.js';
import { UserService } from '../services/UserServices.js';

export class UserController {
  static async newUser(userData: CreateUserDTO): Promise<SingleUserResult> {
    try {
      return await UserService.createUser(userData);
    } catch (error) {
      console.error('Error creating user', error);
      return {
        isSuccess: false,
        message: 'Error creating user.',
        data: null,
      };
    }
  }

  static async checkUserAndPassword(
    loginData: LoginDTO,
  ): Promise<SingleUserResult> {
    try {
      const result = await UserService.authenticateUser(loginData);
      return result;
    } catch (error) {
      console.error('Error in checkUserAndPassword:', error);
      return {
        isSuccess: false,
        message: 'Error during authentication',
        data: null,
      };
    }
  }

  static async getUserById(id: string): Promise<SingleUserResult> {
    try {
      return await UserService.getUserById(id);
    } catch (error) {
      console.error('Error retrieving user by ID:', error);
      return {
        isSuccess: false,
        message: 'Error retrieving user by ID.',
        data: null,
      };
    }
  }

  static async getAllUsers(): Promise<UserListResult> {
    try {
      return await UserService.getAllUsers();
    } catch (error) {
      console.error('Error retrieving all users:', error);
      return {
        isSuccess: false,
        message: 'Error retrieving all users.',
        data: null,
      };
    }
  }

  static async deleteUser(userId: string): Promise<NoDataResult> {
    try {
      return await UserService.deleteUser(userId);
    } catch (error) {
      console.error('Error deleting user:', error);
      return {
        isSuccess: false,
        message: 'Error deleting user.',
      };
    }
  }

  static async updateUser(userData: UpdateUserDTO): Promise<SingleUserResult> {
    try {
      return await UserService.updateUser(userData);
    } catch (error) {
      console.error('Error updating user:', error);
      return {
        isSuccess: false,
        message: 'Error updating user.',
        data: null,
      };
    }
  }

  static async changePassword(
    passwordData: ChangePasswordDTO,
  ): Promise<NoDataResult> {
    try {
      return await UserService.changePassword(passwordData);
    } catch (error) {
      console.error('Error changing password:', error);
      return {
        isSuccess: false,
        message: 'Error changing password.',
      };
    }
  }
}

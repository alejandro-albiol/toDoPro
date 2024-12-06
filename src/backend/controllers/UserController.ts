import { SingleUserResult, UserListResult, NoDataResult } from '../models/ProcessResult.js';
import { User } from '../models/User.js';
import { UserService } from '../services/UserServices.js';

export class UserController {
  static async newUser(user: User): Promise<NoDataResult> {
    try {
      return await UserService.createUser(user);
    } catch (error) {
      console.error('Error creating user', error);
      return { isSuccess: false, message: 'Error creating user.' };
    }
  }

  static async checkUserAndPassword(user: User): Promise<SingleUserResult> {
    try {
      return await UserService.authenticateUser(user);
    } catch (error) {
      console.error('Error authenticating user:', error);
      return { 
        isSuccess: false, 
        message: 'Error authenticating user.',
        data: null
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
        data: null
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
        data: null
      };
    }
  }

  static async deleteUser(userId: string): Promise<NoDataResult> {
    try {
      return await UserService.deleteUser(userId);
    } catch (error) {
      console.error('Error deleting user:', error);
      return { isSuccess: false, message: 'Error deleting user.' };
    }
  }

  static async updateUser(user: User): Promise<SingleUserResult> {
    try {
      return await UserService.updateUser(user);
    } catch (error) {
      console.error('Error updating user:', error);
      return { 
        isSuccess: false, 
        message: 'Error updating user.',
        data: null
      };
    }
  }
}

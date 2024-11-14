import { ProcessResult } from '../models/ProcessResult.js';
import { User } from '../models/User.js';
import { UserService } from '../services/UserServices.js';

export class UserController {

  static async newUser(user:User): Promise<ProcessResult> {
    try {
      const result = await UserService.createUser(user);
      return result;
    } catch (error) {
      return { isSuccess: false, message: 'Error creating user.' };
    }
  }

  static async checkUserAndPassword(user:User): Promise<ProcessResult> {
    try {
      const result = await UserService.authenticateUser(user);
      return result;
    } catch (error) {
      console.error('Error authenticating user:', error);
      return { isSuccess: false, message: 'Error authenticating user.' };
    }
  }

  static async getUserById(id: string): Promise<ProcessResult> {
    try {
      const result = await UserService.getUserById(id);
      return result;
    } catch (error) {
      console.error('Error retrieving user by ID:', error);
      return { isSuccess: false, message: 'Error retrieving user by ID.' };
    }
  }
  static async getAllUsers(): Promise<ProcessResult> {
    try {
      const result = await UserService.getAllUsers();
      return result;
    } catch (error) {
      console.error('Error retrieving all users:', error);
      return { isSuccess: false, message: 'Error retrieving all users.' };
    }
  }
  static async deleteUser(userId: string): Promise<ProcessResult> {
    try {
      const result = await UserService.deleteUser(userId);
      return result;
    } catch (error) {
      console.error('Error deleting user:', error);
      return { isSuccess: false, message: 'Error deleting user.' };
    }
  }

  static async updateUser(user: User): Promise<ProcessResult> {
    try {
      const result = await UserService.updateUser(user);
      return result;
    } catch (error) {
      console.error('Error updating user:', error);
      return { isSuccess: false, message: 'Error updating user.' };
    }
  }
}

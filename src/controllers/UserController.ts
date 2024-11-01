import { UserService } from '../services/UserServices.js';

export class UserController {

  static async newUser(username: string, password: string, email: string): Promise<void> {
    try {
      await UserService.createUser({ username, password, email });
      console.log(`User ${username} created.`);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  }

  static async checkUserAndPassword(username: string, password: string): Promise<void> {
    try {
      const result = await UserService.authenticateUser({ username, password });
      console.log(result);
    } catch (error) {
      console.error('Error authenticating user:', error);
      throw new Error('Authentication failed');
    }
  }
}

import { User } from '../models/User.js';
import { UserService } from '../services/UserServices.js';

export class UserController {

  static async newUser(user:User): Promise<void> {
    try {
      await UserService.createUser(user);
      console.log(`User ${user.username} created.`);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  }

  static async checkUserAndPassword(user:User): Promise<boolean> {
    try {
    const result = await UserService.authenticateUser(user);
    return result
  }catch{
    return false
  }}

  static async sendUserId(user:User):Promise<any>{
    const result = await UserService.getUserId(user)
    return result
  }
}

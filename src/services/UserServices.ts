import { supabase } from '../configuration/supabaseClient.js';
import { User } from '../models/User.js';
import { PasswordServices } from './PasswordServices.js';

export class UserService {

  static async createUser(data: User): Promise<void> {
    const hashedPassword = await PasswordServices.hashPassword(data.password);
    const { error } = await supabase
      .from('users')
      .insert([
        { username: data.username, email: data.email, password: hashedPassword},
      ]);

    if (error) {
      throw new Error(error.message);
    }
  }

  static async deleteUser(data:User):Promise<string>{
    const { data: userData, error } = await supabase
    .from('users')
    .delete()
    .eq('username', data.username)

  if (error || !userData) {
    return "Error deleting user.";
  }else{
    return `${data.username} deleted.`
  }
  }

  static async authenticateUser(user:User): Promise<boolean> {
    const { data: userData, error } = await supabase
      .from('users')
      .select('password')
      .eq('username', user.username)
      .single();
  
    if (error || !userData) {
      return false;
    }
  
    const isPasswordValid = await PasswordServices.verifyPassword(user.password, userData.password);
  
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }
    return isPasswordValid;
  }  

  static async getUserId(user:User){
    const { data: userData, error } = await supabase
    .from('users')
    .select('id')
    .eq('username', user.username)
    .single();
    if (error || !userData) {
      return "User not found";
    }else{
      return userData.id
    }
  }
}
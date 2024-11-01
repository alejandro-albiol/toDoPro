import { supabase } from '../configuration/supabaseClient.js';
import { PasswordServices } from './PasswordServices.js';

export class UserService {

  static async createUser(data: { username: string; email: string; password: string }): Promise<void> {
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

  static async authenticateUser(data: { username: string; password: string }): Promise<{message:string}> {
    const { data: userData, error } = await supabase
      .from('users')
      .select('password')
      .eq('username', data.username)
      .single();
  
    if (error || !userData) {
      throw new Error('User not found');
    }
  
    const isPasswordValid = await PasswordServices.verifyPassword(data.password, userData.password);
  
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }
  
    return { message: 'User authenticated successfully' };
  }  
}
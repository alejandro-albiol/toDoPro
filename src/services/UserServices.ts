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
}

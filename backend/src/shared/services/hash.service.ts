import argon2 from 'argon2';

export class HashService {

  static async hashPassword(password: string): Promise<string> {
    try {
      return await argon2.hash(password);
    } catch (error) {
      console.error('Error hashing password:', error);
      throw new Error('An unexpected error occurred while hashing password, please try again later');
    }
  }

  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, password);
    } catch (error) {
      console.error('Error verifying password:', error);
      throw new Error('An unexpected error occurred while verifying password, please try again later');
    }
  }
}

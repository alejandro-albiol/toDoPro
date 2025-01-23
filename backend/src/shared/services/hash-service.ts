import argon2 from 'argon2';

export class HashService {
  static async hashPassword(password: string): Promise<string> {
    return await argon2.hash(password);
  }

  static async verifyPassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return await argon2.verify(hash, password);
  }
}

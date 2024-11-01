import bcrypt from 'bcrypt';

export class PasswordServices{

    static async hashPassword(password:string):Promise<string>{
        const SALT_ROUNDS = 10;
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        return hashedPassword;
    }
    
      static async verifyPassword(plainPassword:string, hashedPassword:string) {
        return await bcrypt.compare(plainPassword, hashedPassword);
      }
}
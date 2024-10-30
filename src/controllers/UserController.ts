import { Request, Response } from 'express';
import { UserService } from '../services/UserServices.js';

export class UserController {

  static async getUserData(req: Request, res: Response): Promise<void> {
    try {
      const { username, name, password, email } = req.body;
      await UserService.createUser({ username, password, email });
      res.status(201).json({ message: `User ${username} created.` });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

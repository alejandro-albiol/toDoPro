import { Router } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express from 'express';
import { UserController } from '../controllers/UserController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const userRouter = Router();

userRouter.get('/SignIn', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/signIn.html'));
});

userRouter.get('/LogIn', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/logIn.html'));
});

userRouter.post('/SignIn', async (req: express.Request, res: express.Response) => {
    const { username, password, email } = req.body;
    await UserController.newUser(username, password, email);
    res.send('User created successfully.')
})

userRouter.post('/LogIn', async (req: express.Request, res: express.Response) => {
    const { username, password } = req.body;
    try {
      await UserController.checkUserAndPassword(username, password);
      res.send(`Welcome ${username}!`);
    } catch (error) {
      res.status(401).send(error);
    }
  });

export default userRouter;
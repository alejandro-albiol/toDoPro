import { Router } from 'express';
import path from 'path';
import express from 'express';
import { UserController } from '../controllers/UserController.js';
import { __dirname, __filename } from '../configuration/config.js';

const userRouter = Router();

userRouter.get('/SignIn', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/signIn.html'));
});

userRouter.get('/LogIn', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/logIn.html'));
});

userRouter.post('/SignIn', async (req: express.Request, res: express.Response) => {
    const user = req.body;
    await UserController.newUser(user);
    res.send('User created successfully.')
})

userRouter.post('/LogIn', async (req, res) => {
  const user = req.body;

  try {
    const isAuthenticated = await UserController.checkUserAndPassword(user);
    if (isAuthenticated) {
      const userID = await UserController.sendUserId(user)
      res.redirect(`/tasks/${userID}`);
    } else {
      res.status(401).send('Authentication error.');
    }
  } catch (error) {
    res.status(500).send('Internal server error.');
  }
});

export default userRouter;
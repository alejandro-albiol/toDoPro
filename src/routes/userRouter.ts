import { Router } from 'express';
import express from 'express';
import { UserController } from '../controllers/UserController.js';

const userRouter = Router();

userRouter.post('/register', async (req: express.Request, res: express.Response) => {
  const user = req.body;
  try {
    const { isSuccess, message } = await UserController.newUser(user);
    if (isSuccess) {
      res.status(201).json({ message });
    } else {
      res.status(400).json({ message });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
});

userRouter.get('/login', async (req: express.Request, res: express.Response) => {
  const user = req.body;
  try {
    const { isSuccess, message, result: userID } = await UserController.checkUserAndPassword(user);
    if (isSuccess) {
      res.status(200).json({ message, userID });
    } else {
      res.status(401).json({ message });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
});

userRouter.get('/', async (req: express.Request, res: express.Response) => {
  try {
    const users = await UserController.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
});

userRouter.delete('/:id', async (req: express.Request, res: express.Response) => {
  const userId = req.params.id;
  try {
    const { isSuccess, message } = await UserController.deleteUser(userId);
    if (isSuccess) {
      res.status(200).json({ message });
    } else {
      res.status(400).json({ message });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
});

userRouter.put('/:id', async (req: express.Request, res: express.Response) => {
  try {
    const { isSuccess, message } = await UserController.updateUser(req.body);
    if (isSuccess) {
      res.status(200).json({ message });
    } else {
      res.status(400).json({ message });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
});

userRouter.get('/:id', async (req: express.Request, res: express.Response) => {
  try {
    const id = req.params.id;
    const { isSuccess, message, result } = await UserController.getUserById(id);
    if (isSuccess) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
});

export default userRouter;
import { Router } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { UserService } from '../services/UserServices.js';
import express from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const userRouter = Router();
userRouter.use(express.json());

userRouter.get('/SignIn', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/signIn.html'));
});

userRouter.post('/SignIn', async (req: express.Request, res: express.Response) => {
    const result = await UserService.createUser(req.body)
    res.send(result)
})
export default userRouter;
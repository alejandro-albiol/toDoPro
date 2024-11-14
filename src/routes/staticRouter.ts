import path from "path";
import Express from 'express';

const staticRouter = Express.Router()

staticRouter.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/logIn.html'));
});

staticRouter.get('/signin', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/signIn.html'));
});

staticRouter.get('/tasks/:id', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/tasks.html'));
  });
export default staticRouter;
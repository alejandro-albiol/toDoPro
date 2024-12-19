import path from 'path';
import Express from 'express';

const staticRouter = Express.Router();

staticRouter.get('/tasks/new', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'taskCreation.html'));
});

staticRouter.get('/tasks/:taskId', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'taskDetail.html'));
});

staticRouter.get('/home/:userId', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'home.html'));
});

staticRouter.get('/profile/:userId', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'profile.html'));
});

staticRouter.get('/login', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'logIn.html'));
});

staticRouter.get('/signin', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'signIn.html'));
});

staticRouter.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

export default staticRouter;

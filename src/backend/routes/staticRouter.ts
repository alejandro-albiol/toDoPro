import path from 'path';
import Express from 'express';
import { publicPath } from '../configuration/config.js';

const staticRouter = Express.Router();

staticRouter.get('/tasks/new', (req, res) => {
  res.sendFile(path.join(publicPath, 'taskCreation.html'));
});

staticRouter.get('/tasks/:taskId', (req, res) => {
  res.sendFile(path.join(publicPath, 'taskDetail.html'));
});

staticRouter.get('/home/:userId', (req, res) => {
  res.sendFile(path.join(publicPath, 'home.html'));
});

staticRouter.get('/profile/:userId', (req, res) => {
  res.sendFile(path.join(publicPath, 'profile.html'));
});

staticRouter.get('/login', (req, res) => {
  res.sendFile(path.join(publicPath, 'logIn.html'));
});

staticRouter.get('/signin', (req, res) => {
  res.sendFile(path.join(publicPath, 'signIn.html'));
});

staticRouter.get('/', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

export default staticRouter;

import path from 'path';
import Express from 'express';

const staticRouter = Express.Router();

staticRouter.get('/tasks/new', sendHtml('taskCreation.html'));
staticRouter.get('/tasks/:taskId', sendHtml('taskDetail.html'));
staticRouter.get('/home/:userId', sendHtml('home.html'));
staticRouter.get('/profile/:userId', sendHtml('profile.html'));
staticRouter.get('/login', sendHtml('logIn.html'));
staticRouter.get('/signin', sendHtml('signIn.html'));
staticRouter.get('/', sendHtml('index.html'));

function sendHtml(filename: string) {
    return (req: Express.Request, res: Express.Response) => {
        res.sendFile(path.join(process.cwd(), '..', 'public', filename));
    };
}

export default staticRouter;

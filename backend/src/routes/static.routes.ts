import { Router, Request, Response } from 'express';
import path from 'path';

/**
 * Configures and returns a new Router instance with static routes
 * Handles serving static HTML files for various routes
 * @returns Configured Express Router instance
 */
export const configureStaticRoutes = (): Router => {
    const router = Router();

    router.get('/tasks/new', sendHtml('taskCreation.html'));
    router.get('/tasks/:taskId', sendHtml('taskDetail.html'));
    router.get('/home/:userId', sendHtml('home.html'));
    router.get('/profile/:userId', sendHtml('profile.html'));
    router.get('/login', sendHtml('logIn.html'));
    router.get('/register', sendHtml('register.html'));
    router.get('/HttpError', sendHtml('httpError.html'))
    router.get('/', sendHtml('index.html'));

    function sendHtml(filename: string) {
        return (req: Request, res: Response) => {
            res.sendFile(path.join(process.cwd(), '..', 'public', filename));
        };
    }

    return router;
};

export default configureStaticRoutes;

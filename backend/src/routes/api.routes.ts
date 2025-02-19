import Express from 'express';
import { configureUserRoutes } from '../users/routes/user.routes.js';
import { configureTaskRoutes } from '../tasks/routes/task.routes.js';
import { configureAuthRoutes } from '../auth/routes/auth.routes.js';
import { UserController } from '../users/controller/user.controller.js';
import { TaskController } from '../tasks/controller/task.controller.js';
import { AuthController } from '../auth/controller/auth.controller.js';
import { UserService } from '../users/service/user.service.js';
import { TaskService } from '../tasks/service/task.service.js';
import { AuthService } from '../auth/service/auth.service.js';
import { JwtService } from '../auth/service/jwt.service.js';
import { UserRepository } from '../users/repository/user.repository.js';
import { TaskRepository } from '../tasks/repository/task.repository.js';
import { pool } from '../config/database.config.js';
import { AuthMiddleware } from '../middlewares/auth.middleware.js';

const apiRouter = Express.Router();


const userRepository = new UserRepository(pool);
const taskRepository = new TaskRepository(pool);

const jwtService = new JwtService();
const userService = new UserService(userRepository);
const taskService = new TaskService(taskRepository);
const authService = new AuthService(userService, jwtService);

const authController = new AuthController(authService);
const userController = new UserController(userService);
const taskController = new TaskController(taskService);

const authMiddleware = new AuthMiddleware(jwtService);

apiRouter.use('/auth', configureAuthRoutes(authController, authMiddleware));
apiRouter.use('/users', authMiddleware.authenticate, configureUserRoutes(userController));
apiRouter.use('/tasks', authMiddleware.authenticate, configureTaskRoutes(taskController));

export default apiRouter;

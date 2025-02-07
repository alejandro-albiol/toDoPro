import express from 'express';
import { errorHandler } from './middlewares/error-handler.js';
import swaggerUi from 'swagger-ui-express';
import { swaggerConfig } from './docs/swagger.config.js';
import path from 'path';
import { configureUserRoutes } from './users/routes/user.routes.js';
import { configureAuthRoutes } from './auth/routes/auth.routes.js';
import { AuthController } from './auth/controller/auth.controller.js';
import { AuthService } from './auth/service/auth.service.js';
import { JwtService } from './auth/service/jwt.service.js';
import { UserService } from './users/service/user.service.js';
import { UserRepository } from './users/repository/user.repository.js';
import { UserController } from './users/controller/user.controller.js';
import { AuthMiddleware } from './middlewares/auth.middleware.js';
import { pool } from './config/database.config.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), '..', 'public')));

// Initialize services
const jwtService = new JwtService();
const userRepository = new UserRepository(pool);
const userService = new UserService(userRepository);
const authService = new AuthService(userService, jwtService);

// Initialize controllers
const authController = new AuthController(authService);
const userController = new UserController(userService);

// Initialize middleware
const authMiddleware = new AuthMiddleware(jwtService);

// Configure routes
const apiRouter = express.Router();

// Auth routes (public)
apiRouter.use('/auth', configureAuthRoutes(authController, authMiddleware));

// Protected routes
apiRouter.use('/users', authMiddleware.authenticate, configureUserRoutes(userController));

// API routes
app.use('/api/v1', apiRouter);

// Static routes
app.use('/', (req, res, next) => {
    if (req.path.startsWith('/api')) {
        next();
        return;
    }
    res.sendFile(path.join(process.cwd(), '..', 'public', 'index.html'));
});

// API documentation
app.use('/api-docs', swaggerUi.serve as unknown as express.RequestHandler[]);
app.use('/api-docs', swaggerUi.setup(swaggerConfig, { explorer: true }) as unknown as express.RequestHandler);

// Error handling
app.use(errorHandler);

export default app;
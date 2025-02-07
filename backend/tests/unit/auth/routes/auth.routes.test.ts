import { Router } from 'express';
import { configureAuthRoutes } from '../../../../src/auth/routes/auth.routes.js';
import { AuthController } from '../../../../src/auth/controller/auth.controller.js';
import { AuthMiddleware } from '../../../../src/middlewares/auth.middleware.js';
import { UserValidator } from '../../../../src/middlewares/validators/user-validator.js';

jest.mock('../../../../src/middlewares/validators/user-validator.js');

describe('Auth Routes', () => {
    let mockController: jest.Mocked<AuthController>;
    let mockAuthMiddleware: jest.Mocked<AuthMiddleware>;
    let router: Router;

    beforeEach(() => {
        mockController = {
            register: jest.fn(),
            login: jest.fn(),
            changePassword: jest.fn(),
            initiatePasswordReset: jest.fn(),
            resetPassword: jest.fn()
        } as any;

        mockAuthMiddleware = {
            authenticate: jest.fn()
        } as any;

        const mockMiddleware = (req: any, res: any, next: any) => next();
        
        (UserValidator.validateCreate as jest.Mock).mockReturnValue(mockMiddleware);
        (UserValidator.validateLogin as jest.Mock).mockReturnValue(mockMiddleware);
        (UserValidator.validateEmail as jest.Mock).mockReturnValue(mockMiddleware);
        (UserValidator.validatePasswordReset as jest.Mock).mockReturnValue(mockMiddleware);
        (UserValidator.validatePasswordChange as jest.Mock).mockReturnValue(mockMiddleware);

        router = configureAuthRoutes(mockController, mockAuthMiddleware);
    });

    it('should configure POST /register route with validation', () => {
        const route = findRoute(router, 'post', '/register');
        
        expect(route).toBeDefined();
        expect(route.stack).toHaveLength(2);
        expect(UserValidator.validateCreate).toHaveBeenCalled();
        
        const req = {} as any;
        const res = {} as any;
        route.stack[1].handle(req, res);
        expect(mockController.register).toHaveBeenCalledWith(req, res);
    });

    it('should configure POST /login route with validation', () => {
        const route = findRoute(router, 'post', '/login');
        
        expect(route).toBeDefined();
        expect(route.stack).toHaveLength(2);
        expect(UserValidator.validateLogin).toHaveBeenCalled();
        
        const req = {} as any;
        const res = {} as any;
        route.stack[1].handle(req, res);
        expect(mockController.login).toHaveBeenCalledWith(req, res);
    });

    it('should configure POST /password-reset/initiate route with validation', () => {
        const route = findRoute(router, 'post', '/password-reset/initiate');
        
        expect(route).toBeDefined();
        expect(route.stack).toHaveLength(2);
        expect(UserValidator.validateEmail).toHaveBeenCalled();
        
        const req = {} as any;
        const res = {} as any;
        route.stack[1].handle(req, res);
        expect(mockController.initiatePasswordReset).toHaveBeenCalledWith(req, res);
    });

    it('should configure POST /password-reset/complete route with validation', () => {
        const route = findRoute(router, 'post', '/password-reset/complete');
        
        expect(route).toBeDefined();
        expect(route.stack).toHaveLength(2);
        expect(UserValidator.validatePasswordReset).toHaveBeenCalled();
        
        const req = {} as any;
        const res = {} as any;
        route.stack[1].handle(req, res);
        expect(mockController.resetPassword).toHaveBeenCalledWith(req, res);
    });

    it('should configure POST /password/change route with authentication and validation', () => {
        const route = findRoute(router, 'post', '/password/change');
        
        expect(route).toBeDefined();
        expect(route.stack).toHaveLength(3);
        expect(route.stack[0].handle).toBe(mockAuthMiddleware.authenticate);
        expect(UserValidator.validatePasswordChange).toHaveBeenCalled();
        
        const req = {} as any;
        const res = {} as any;
        route.stack[2].handle(req, res);
        expect(mockController.changePassword).toHaveBeenCalledWith(req, res);
    });
});

// Helper function to find a route in the router
function findRoute(router: Router, method: string, path: string) {
    const routes = (router as any).stack;
    return routes.find(
        (route: any) => 
            route.route &&
            route.route.path === path &&
            route.route.methods[method.toLowerCase()]
    )?.route;
} 
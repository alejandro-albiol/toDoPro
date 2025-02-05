import { Router } from 'express';
import { configureUserRoutes } from '../../../../src/users/routes/user.routes.js';
import { UserController } from '../../../../src/users/controller/user.controller.js';
import { UserValidator } from '../../../../src/middlewares/validators/user-validator.js';
import { IdValidator } from '../../../../src/middlewares/validators/id-validator.js';

jest.mock('../../../../src/middlewares/validators/user-validator.js');
jest.mock('../../../../src/middlewares/validators/id-validator.js');

describe('User Routes', () => {
    let mockController: jest.Mocked<UserController>;
    let router: Router;

    beforeEach(() => {
        mockController = {
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            updatePassword: jest.fn(),
            delete: jest.fn()
        } as any;

        const mockMiddleware = (req: any, res: any, next: any) => next();
        
        (UserValidator.validateCreate as jest.Mock).mockReturnValue(mockMiddleware);
        (UserValidator.validateUpdate as jest.Mock).mockReturnValue(mockMiddleware);
        (UserValidator.validatePassword as jest.Mock).mockReturnValue(mockMiddleware);
        (IdValidator.validate as jest.Mock).mockReturnValue(mockMiddleware);

        router = configureUserRoutes(mockController);
    });

    it('should configure POST / route with validation', () => {
        const route = findRoute(router, 'post', '/');
        
        expect(route).toBeDefined();
        expect(route.stack).toHaveLength(2);
        expect(typeof route.stack[0].handle).toBe('function');
        
        const req = {} as any;
        const res = {} as any;
        route.stack[1].handle(req, res);
        expect(mockController.create).toHaveBeenCalledWith(req, res);

    });

    it('should configure GET / route', () => {
        const route = findRoute(router, 'get', '/');
        
        expect(route).toBeDefined();
        expect(route.stack).toHaveLength(1);
        
        const req = {} as any;
        const res = {} as any;
        route.stack[0].handle(req, res);
        expect(mockController.findAll).toHaveBeenCalledWith(req, res);
    });

    it('should configure GET /:id route with validation', () => {
        const route = findRoute(router, 'get', '/:id');
        
        expect(route).toBeDefined();
        expect(route.stack).toHaveLength(2);
        expect(typeof route.stack[0].handle).toBe('function');
        
        const req = {} as any;
        const res = {} as any;
        route.stack[1].handle(req, res);
        expect(mockController.findById).toHaveBeenCalledWith(req, res);
    });

    it('should configure PUT /:id route with validation', () => {
        const route = findRoute(router, 'put', '/:id');
        
        expect(route).toBeDefined();
        expect(route.stack).toHaveLength(3);
        expect(typeof route.stack[0].handle).toBe('function');
        expect(typeof route.stack[1].handle).toBe('function');
        
        const req = {} as any;
        const res = {} as any;
        route.stack[2].handle(req, res);
        expect(mockController.update).toHaveBeenCalledWith(req, res);
    });

    it('should configure PATCH /:id/password route with validation', () => {
        const route = findRoute(router, 'patch', '/:id/password');
        
        expect(route).toBeDefined();
        expect(route.stack).toHaveLength(3);
        expect(typeof route.stack[0].handle).toBe('function');
        expect(typeof route.stack[1].handle).toBe('function');
        
        const req = {} as any;
        const res = {} as any;
        route.stack[2].handle(req, res);
        expect(mockController.updatePassword).toHaveBeenCalledWith(req, res);
    });

    it('should configure DELETE /:id route with validation', () => {
        const route = findRoute(router, 'delete', '/:id');
        
        expect(route).toBeDefined();
        expect(route.stack).toHaveLength(2);
        expect(typeof route.stack[0].handle).toBe('function');
        
        const req = {} as any;
        const res = {} as any;
        route.stack[1].handle(req, res);
        expect(mockController.delete).toHaveBeenCalledWith(req, res);
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
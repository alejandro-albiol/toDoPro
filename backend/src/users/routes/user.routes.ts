import { Router } from 'express';
import { UserValidator } from '../../middlewares/validators/user-validator.js';
import { IdValidator } from '../../middlewares/validators/id-validator.js';
import { IUserController } from '../controller/i-user.controller.js';

/**
 * Configures and returns a new Router instance with user routes
 * Handles only user resource management operations for regular users
 * Authentication operations are handled by the auth module
 * @param controller Implementation of IUserController to handle route logic
 * @returns Configured Express Router instance
 */
export const configureUserRoutes = (controller: IUserController): Router => {
    const router = Router();
    
    router.get('/:id',
        IdValidator.validate('id'),
        (req, res) => controller.findById(req, res)
    );
    
    router.put('/:id',
        IdValidator.validate('id'),
        UserValidator.validateUpdate(),
        (req, res) => controller.update(req, res)
    );
    
    router.delete('/:id',
        IdValidator.validate('id'),
        (req, res) => controller.delete(req, res)
    );
    
    return router;
}; 
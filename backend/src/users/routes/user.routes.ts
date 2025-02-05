import { Router } from 'express';
import { UserValidator } from '../../middlewares/validators/user-validator.js';
import { IdValidator } from '../../middlewares/validators/id-validator.js';
import { IUserController } from '../controller/i-user.controller.js';

/**
 * Configures and returns a new Router instance with user routes
 * @param controller Implementation of IUserController to handle route logic
 * @returns Configured Express Router instance
 */
export const configureUserRoutes = (controller: IUserController): Router => {
    const router = Router();

    router.post('/', 
        UserValidator.validateCreate(),
        (req, res) => controller.create(req, res)
    );
    
    router.get('/',
        (req, res) => controller.findAll(req, res)
    );
    
    router.get('/:id',
        IdValidator.validate('id'),
        (req, res) => controller.findById(req, res)
    );
    
    router.put('/:id',
        IdValidator.validate('id'),
        UserValidator.validateUpdate(),
        (req, res) => controller.update(req, res)
    );
    
    router.patch('/:id/password',
        IdValidator.validate('id'),
        UserValidator.validatePassword(),
        (req, res) => controller.updatePassword(req, res)
    );
    
    router.delete('/:id',
        IdValidator.validate('id'),
        (req, res) => controller.delete(req, res)
    );
    
    return router;
}; 
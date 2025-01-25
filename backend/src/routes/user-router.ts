import express from 'express';
import { UserController } from '../users/controller/user-controller.js';
import { UserService } from '../users/service/user-service.js';
import { UserRepository } from '../users/repository/user-repository.js';
import { ApiResponse } from '../shared/responses/api-response.js';
import { IdValidator } from '../middlewares/validators/id-validator.js';
import { UserValidator } from '../middlewares/validators/user-validator.js';

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

const userRouter = express.Router();

userRouter.post('/', 
    UserValidator.validateCreate(),
    async (req, res, next) => {
        try {
            const user = await userController.create(req.body);
            res.status(201).json(new ApiResponse('success', 'User created successfully', user));
        } catch (error) {
            next(error);
        }
    }
);

userRouter.get('/:id', 
    IdValidator.validate('id'),
    async (req, res, next) => {
        try {
            const user = await userController.findById(req.params.id);
            res.status(200).json(new ApiResponse('success', 'User found', user));
        } catch (error) {
            next(error);
        }
    }
);

userRouter.put('/:id',
    IdValidator.validate('id'),
    UserValidator.validateUpdate(),
    async (req, res, next) => {
        try {
            const userData = {
                id: req.params.id,
                ...req.body
            };
            const user = await userController.update(userData);
            res.status(201).json(new ApiResponse('success', 'User updated successfully', user));
        } catch (error) {
            next(error);
        }
    }
);

userRouter.put('/:id/password',
    IdValidator.validate('id'),
    UserValidator.validatePassword(),
    async (req, res, next) => {
        try {
            await userController.updatePassword(req.params.id, req.body.password);
            res.status(201).json(new ApiResponse('success', 'Password updated successfully', null));
        } catch (error) {
            next(error);
        }
    }
);

userRouter.delete('/:id', IdValidator.validate('id'), async (req, res, next) => {
    try {
        await userController.delete(req.params.id);
        res.status(200).json(new ApiResponse('success', 'User deleted successfully', null));
    } catch (error) {
        next(error);
    }
});

export default userRouter;
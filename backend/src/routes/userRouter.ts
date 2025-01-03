import express from 'express';
import { UserController } from '../users/controller/UserController';
import { UserService } from '../users/service/UserService';
import { UserRepository } from '../users/repository/UserRepository';
import { ApiResponse } from '../shared/models/responses/ApiResponse';

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

const userRouter = express.Router();

// TODO: Añadir middleware de validación para create y update
userRouter.post('/', async (req, res, next) => {
    try {
        const user = await userController.create(req.body);
        res.status(201).json(new ApiResponse('success', 'User created successfully', user));
    } catch (error) {
        next(error);
    }
});

// TODO: Añadir middleware de autenticación para rutas protegidas
userRouter.get('/:id', async (req, res, next) => {
    try {
        const user = await userController.findById(req.params.id);
        res.status(200).json(new ApiResponse('success', 'User found', user));
    } catch (error) {
        next(error);
    }
});

userRouter.put('/:id', async (req, res, next) => {
    try {
        const user = await userController.update(req.body);
        res.status(200).json(new ApiResponse('success', 'User updated successfully', user));
    } catch (error) {
        next(error);
    }
});

userRouter.put('/:id/password', async (req, res, next) => {
    try {
        const { password } = req.body;
        await userController.updatePassword(req.params.id, password);
        res.status(200).json(new ApiResponse('success', 'Password updated successfully', null));
    } catch (error) {
        next(error);
    }
});

userRouter.delete('/:id', async (req, res, next) => {
    try {
        await userController.delete(req.params.id);
        res.status(200).json(new ApiResponse('success', 'User deleted successfully', null));
    } catch (error) {
        next(error);
    }
});

export default userRouter;

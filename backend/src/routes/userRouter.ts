import express from 'express';
import { UserController } from '../users/controller/UserController.js';
import { UserService } from '../users/service/UserService.js';
import { UserRepository } from '../users/repository/UserRepository.js';
import { ApiResponse } from '../shared/models/responses/ApiResponse.js';

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

const userRouter = express.Router();

/**
 * @swagger
 * /api/v1/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserDTO'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: User created successfully
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       code:
 *                         type: string
 *                         enum: [USERNAME_ALREADY_EXISTS, EMAIL_ALREADY_EXISTS]
 *                       message:
 *                         type: string
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateUserDTO:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         username:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           format: password
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         username:
 *           type: string
 *         email:
 *           type: string
 */

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

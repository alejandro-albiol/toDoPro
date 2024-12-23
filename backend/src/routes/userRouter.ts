import express from 'express';
import { UserController } from '../users/controllers/UserController.js';
import { UserServices } from '../users/services/UserServices.js';
import { UserRepository } from '../users/repository/UserRepository.js';

const userRepository = new UserRepository();
const userService = new UserServices(userRepository);
const userController = new UserController(userService);

const router = express.Router();

// TODO: Añadir middleware de validación para create y update
router.post('/', userController.create.bind(userController));

// TODO: Añadir middleware de autenticación para rutas protegidas
router.get('/:id', userController.findById.bind(userController));
router.put('/:id', userController.update.bind(userController));
router.delete('/:id', userController.delete.bind(userController));

export default router;

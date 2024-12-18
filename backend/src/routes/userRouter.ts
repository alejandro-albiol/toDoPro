import express from 'express';
import { UserController } from '../controllers/UserController.js';
import { UserServices } from '../services/UserServices.js';
import { UserRepository } from '../repositories/UserRepository.js';
import { UserValidator } from '../middlewares/userValidator.js';

const userRepository = new UserRepository();
const userService = new UserServices(userRepository);
const userController = new UserController(userService);

const router = express.Router();

// TODO: Añadir middleware de validación para create y update
router.post('/', userController.create.bind(userController));

// TODO: Añadir middleware de autenticación para rutas protegidas
router.get('/:id', userController.findById.bind(userController));
router.get('/email/:email', userController.findByEmail.bind(userController));
router.put('/:id', userController.update.bind(userController));
router.delete('/:id', userController.delete.bind(userController));

export default router; 
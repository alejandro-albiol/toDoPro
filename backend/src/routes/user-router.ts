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

/**
 * @swagger
 * components:
 *   schemas:
 *     # DTOs
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
 *     
 *     UpdateUserDTO:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *         username:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *     
 *     UserUpdatedDTO:
 *       type: object
 *       required:
 *         - id
 *         - username
 *         - email
 *       properties:
 *         id:
 *           type: string
 *         username:
 *           type: string
 *         email:
 *           type: string
 *     
 *     # Authentication DTOs
 *     ChangePasswordDTO:
 *       type: object
 *       required:
 *         - userId
 *         - currentPassword
 *         - newPassword
 *       properties:
 *         userId:
 *           type: string
 *         currentPassword:
 *           type: string
 *           format: password
 *         newPassword:
 *           type: string
 *           format: password
 *     
 *     LoginDTO:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *         password:
 *           type: string
 *           format: password
 *     
 *     # Entities
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *           format: password
 *     
 *     # Response Models
 *     ApiResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum: [success, error]
 *         message:
 *           type: string
 *         data:
 *           type: object
 *         errors:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ApiError'
 *     
 *     ApiError:
 *       type: object
 *       properties:
 *         code:
 *           type: string
 *         message:
 *           type: string
 *   
 *   responses:
 *     # User Errors
 *     UserNotFound:
 *       description: User not found
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApiResponse'
 *           example:
 *             status: "error"
 *             message: "User not found"
 *             errors:
 *               - code: "U1"
 *                 message: "User with id {id} not found"
 *     
 *     UserConflict:
 *       description: Username or email already exists
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApiResponse'
 *           examples:
 *             emailExists:
 *               value:
 *                 status: "error"
 *                 message: "Email already exists"
 *                 errors:
 *                   - code: "U2"
 *                     message: "User with email '{email}' already exists"
 *             usernameExists:
 *               value:
 *                 status: "error"
 *                 message: "Username already exists"
 *                 errors:
 *                   - code: "U3"
 *                     message: "User with username '{username}' already exists"
 *     
 *     InvalidUserData:
 *       description: Invalid user data provided
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApiResponse'
 *           example:
 *             status: "error"
 *             message: "Invalid user data"
 *             errors:
 *               - code: "U4"
 *                 message: "Invalid user data provided"
 *     
 *     # Format Errors
 *     BadJsonFormat:
 *       description: Invalid JSON format in request body
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApiResponse'
 *           example:
 *             status: "error"
 *             message: "Invalid JSON format"
 *             errors:
 *               - code: "F1"
 *                 message: "Request body is not a valid JSON"
 *     
 *     BadIdFormat:
 *       description: Invalid ID format
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApiResponse'
 *           example:
 *             status: "error"
 *             message: "Invalid ID format"
 *             errors:
 *               - code: "F2"
 *                 message: "Invalid ID format"
 *     
 *     # Database Errors
 *     DatabaseError:
 *       description: Database error occurred
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApiResponse'
 *           examples:
 *             uniqueViolation:
 *               value:
 *                 status: "error"
 *                 message: "User already exists"
 *                 errors:
 *                   - code: "23505"
 *                     message: "Unique constraint violation"
 *             invalidInput:
 *               value:
 *                 status: "error"
 *                 message: "Invalid data type provided"
 *                 errors:
 *                   - code: "22P02"
 *                     message: "Invalid input syntax"
 * 
 * paths:
 *   /api/v1/users:
 *     # CREATE
 *     post:
 *       summary: Create a new user
 *       tags: [Users]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateUserDTO'
 *       responses:
 *         201:
 *           description: User created successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ApiResponse'
 *         400:
 *           description: Invalid data provided
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ApiResponse'
 *               examples:
 *                 invalidJson:
 *                   value:
 *                     status: "error"
 *                     message: "Invalid JSON format"
 *                     errors:
 *                       - code: "F1"
 *                         message: "Request body is not a valid JSON"
 *                 invalidData:
 *                   value:
 *                     status: "error"
 *                     message: "Invalid user data"
 *                     errors:
 *                       - code: "U4"
 *                         message: "Invalid user data provided"
 *         409:
 *           description: User already exists
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ApiResponse'
 *               examples:
 *                 emailExists:
 *                   value:
 *                     status: "error"
 *                     message: "Email already exists"
 *                     errors:
 *                       - code: "U2"
 *                         message: "User with email '{email}' already exists"
 *                 usernameExists:
 *                   value:
 *                     status: "error"
 *                     message: "Username already exists"
 *                     errors:
 *                       - code: "U3"
 *                         message: "User with username '{username}' already exists"
 *         500:
 *           description: Internal server error
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ApiResponse'
 *               example:
 *                 status: "error"
 *                 message: "Internal server error"
 *                 errors:
 *                   - code: "UNKNOWN_ERROR"
 *                     message: "An unexpected error occurred"
 * 
 *   /api/v1/users/{id}:
 *     # READ
 *     get:
 *       summary: Get user by ID
 *       tags: [Users]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: User ID
 *       responses:
 *         200:
 *           description: User found successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ApiResponse'
 *         400:
 *           description: Invalid ID format
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ApiResponse'
 *               example:
 *                 status: "error"
 *                 message: "Invalid ID format"
 *                 errors:
 *                   - code: "F2"
 *                     message: "Invalid ID format provided"
 *         404:
 *           description: User not found
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ApiResponse'
 *               example:
 *                 status: "error"
 *                 message: "User not found"
 *                 errors:
 *                   - code: "U1"
 *                     message: "User with id {id} not found"
 *         500:
 *           description: Internal server error
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ApiResponse'
 *               example:
 *                 status: "error"
 *                 message: "Internal server error"
 *                 errors:
 *                   - code: "UNKNOWN_ERROR"
 *                     message: "An unexpected error occurred"
 *     
 *     # UPDATE
 *     put:
 *       summary: Update user by ID
 *       tags: [Users]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: User ID
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateUserDTO'
 *       responses:
 *         200:
 *           description: User updated successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ApiResponse'
 *         400:
 *           description: Invalid data provided
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ApiResponse'
 *               examples:
 *                 invalidJson:
 *                   value:
 *                     status: "error"
 *                     message: "Invalid JSON format"
 *                     errors:
 *                       - code: "F1"
 *                         message: "Request body is not a valid JSON"
 *                 invalidId:
 *                   value:
 *                     status: "error"
 *                     message: "Invalid ID format"
 *                     errors:
 *                       - code: "F2"
 *                         message: "Invalid ID format provided"
 *                 invalidData:
 *                   value:
 *                     status: "error"
 *                     message: "Invalid user data"
 *                     errors:
 *                       - code: "U4"
 *                         message: "Invalid user data provided"
 *         404:
 *           description: User not found
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ApiResponse'
 *               example:
 *                 status: "error"
 *                 message: "User not found"
 *                 errors:
 *                   - code: "U1"
 *                     message: "User with id {id} not found"
 *         409:
 *           description: Email or username already exists
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ApiResponse'
 *               examples:
 *                 emailExists:
 *                   value:
 *                     status: "error"
 *                     message: "Email already exists"
 *                     errors:
 *                       - code: "U2"
 *                         message: "User with email '{email}' already exists"
 *                 usernameExists:
 *                   value:
 *                     status: "error"
 *                     message: "Username already exists"
 *                     errors:
 *                       - code: "U3"
 *                         message: "User with username '{username}' already exists"
 *         500:
 *           description: Internal server error
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ApiResponse'
 *               example:
 *                 status: "error"
 *                 message: "Internal server error"
 *                 errors:
 *                   - code: "UNKNOWN_ERROR"
 *                     message: "An unexpected error occurred"
 *     
 *     # DELETE
 *     delete:
 *       summary: Delete user by ID
 *       tags: [Users]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: User ID
 *       responses:
 *         200:
 *           description: User deleted successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ApiResponse'
 *         400:
 *           description: Invalid ID format
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ApiResponse'
 *               example:
 *                 status: "error"
 *                 message: "Invalid ID format"
 *                 errors:
 *                   - code: "F2"
 *                     message: "Invalid ID format provided"
 *         404:
 *           description: User not found
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ApiResponse'
 *               example:
 *                 status: "error"
 *                 message: "User not found"
 *                 errors:
 *                   - code: "U1"
 *                     message: "User with id {id} not found"
 *         500:
 *           description: Internal server error
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ApiResponse'
 *               example:
 *                 status: "error"
 *                 message: "Internal server error"
 *                 errors:
 *                   - code: "UNKNOWN_ERROR"
 *                     message: "An unexpected error occurred"
 * 
 *   # Additional Operations
 *   /api/v1/users/{id}/password:
 *     put:
 *       summary: Update user password
 *       tags: [Users]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: User ID
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChangePasswordDTO'
 *       responses:
 *         200:
 *           description: Password updated successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ApiResponse'
 *         400:
 *           description: Invalid data provided
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ApiResponse'
 *               examples:
 *                 invalidJson:
 *                   value:
 *                     status: "error"
 *                     message: "Invalid JSON format"
 *                     errors:
 *                       - code: "F1"
 *                         message: "Request body is not a valid JSON"
 *                 invalidId:
 *                   value:
 *                     status: "error"
 *                     message: "Invalid ID format"
 *                     errors:
 *                       - code: "F2"
 *                         message: "Invalid ID format provided"
 *                 invalidPassword:
 *                   value:
 *                     status: "error"
 *                     message: "Invalid password"
 *                     errors:
 *                       - code: "A1"
 *                         message: "Invalid password provided"
 *         404:
 *           description: User not found
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ApiResponse'
 *               example:
 *                 status: "error"
 *                 message: "User not found"
 *                 errors:
 *                   - code: "U1"
 *                     message: "User with id {id} not found"
 *         500:
 *           description: Internal server error
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ApiResponse'
 *               example:
 *                 status: "error"
 *                 message: "Internal server error"
 *                 errors:
 *                   - code: "UNKNOWN_ERROR"
 *                     message: "An unexpected error occurred"
 */

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
            res.status(200).json(new ApiResponse('success', 'User updated successfully', user));
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
            res.status(200).json(new ApiResponse('success', 'Password updated successfully', null));
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
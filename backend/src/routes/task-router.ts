import express from 'express';
import { TaskController } from '../tasks/controller/task-controller.js';
import { TaskValidator } from '../middlewares/validators/task-validator.js';
import { IdValidator } from '../middlewares/validators/id-validator.js';
import { ApiResponse } from '../shared/responses/api-response.js';
import { TaskRepository } from '../tasks/repository/task-repository.js';
import { TaskService } from '../tasks/service/task-service.js';

const taskRepository = new TaskRepository();
const taskService = new TaskService(taskRepository);
const taskController = new TaskController(taskService);

const taskRouter = express.Router();

taskRouter.post('/',
    TaskValidator.validateCreate(),
    async (req, res, next) => {
        try {
            const task = await taskController.create(req.body);
            res.status(201).json(new ApiResponse('success', 'Task created successfully', task));
        } catch (error) {
            next(error);
        }
    }
);

taskRouter.get('/user/:userId',
    IdValidator.validate('userId'),
    async (req, res, next) => {
        try {
            const tasks = await taskController.findAllByUserId(req.params.userId);
            res.status(200).json(new ApiResponse('success', 'Tasks found successfully', tasks));
        } catch (error) {
            next(error);
        }
    }
);

taskRouter.get('/:id',
    IdValidator.validate('id'),
    async (req, res, next) => {
        try {
            const task = await taskController.findById(req.params.id);
            res.status(200).json(new ApiResponse('success', 'Task found successfully', task));
        } catch (error) {
            next(error);
        }
    }
);

taskRouter.put('/:id',
    IdValidator.validate('id'),
    TaskValidator.validateUpdate(),
    async (req, res, next) => {
        try {
            const task = await taskController.update({
                id: req.params.id,
                ...req.body
            });
            res.status(200).json(new ApiResponse('success', 'Task updated successfully', task));
        } catch (error) {
            next(error);
        }
    }
);

taskRouter.put('/:id/toggle-completed',
    IdValidator.validate('id'),
    async (req, res, next) => {
        try {
            const task = await taskController.toggleCompleted(req.params.id);
            res.status(200).json(new ApiResponse('success', 'Task completed status toggled successfully', task));
        } catch (error) {
            next(error);
        }
    }
);

taskRouter.delete('/:id',
    IdValidator.validate('id'),
    async (req, res, next) => {
        try {
            await taskController.delete(req.params.id);
            res.status(204).json(new ApiResponse('success', 'Task deleted successfully', null));
        } catch (error) {
            next(error);
        }
    }
);

export default taskRouter;
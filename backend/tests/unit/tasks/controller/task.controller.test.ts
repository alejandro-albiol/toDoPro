import { Request, Response } from 'express';
import { TaskController } from '../../../../src/tasks/controller/task.controller';
import { ITaskService } from '../../../../src/tasks/service/i-task.service';
import { CreateTaskDTO } from '../../../../src/tasks/models/dtos/create-task.dto';
import { UpdateTaskDTO } from '../../../../src/tasks/models/dtos/update-task.dto';
import { TaskException } from '../../../../src/tasks/exceptions/base-task.exception';
import { TaskNotFoundException } from '../../../../src/tasks/exceptions/task-not-found.exception';
import { ApiResponse } from '../../../../src/shared/responses/api-response';

jest.mock('../../../../src/shared/responses/api-response');

describe('TaskController', () => {
    let taskController: TaskController;
    let taskService: jest.Mocked<ITaskService>;
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        taskService = {
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            findAllByUserId: jest.fn(),
            findAllCompletedByUserId: jest.fn(),
            update: jest.fn(),
            toggleCompleted: jest.fn(),
            delete: jest.fn(),
        };
        taskController = new TaskController(taskService);
        req = { body: {}, params: {} };
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    });

    describe('create', () => {
        it('should create a task and return 201 status', async () => {
            const createDto: CreateTaskDTO = { title: 'Test Task', description: 'Test Description', user_id: '12345' };
            req.body = createDto;
            taskService.create.mockResolvedValue(createDto);

            await taskController.create(req as Request, res as Response);

            expect(taskService.create).toHaveBeenCalledWith(createDto);
            expect(ApiResponse.created).toHaveBeenCalledWith(res, createDto);
        });

        it('should handle errors', async () => {
            const error = new Error('Test Error');
            taskService.create.mockRejectedValue(error);

            await taskController.create(req as Request, res as Response);

            expect(ApiResponse.error).toHaveBeenCalledWith(res, error);
        });
    });

    describe('findAll', () => {
        it('should return all tasks', async () => {
            const tasks = [{ id: '1', title: 'Test Task', description: 'Test Description', user_id: '12345', creation_date: new Date(), completed: false}];
            taskService.findAll.mockResolvedValue(tasks);

            await taskController.findAll(req as Request, res as Response);

            expect(taskService.findAll).toHaveBeenCalled();
            expect(ApiResponse.success).toHaveBeenCalledWith(res, tasks);
        });

        it('should handle errors', async () => {
            const error = new Error('Test Error');
            taskService.findAll.mockRejectedValue(error);

            await taskController.findAll(req as Request, res as Response);

            expect(ApiResponse.error).toHaveBeenCalledWith(res, error);
        });
    });

    describe('findById', () => {
        it('should return a task by id', async () => {
            const task = { id: '1', title: 'Test Task' };
            req.params!.id = '1';
            taskService.findById.mockResolvedValue(task);

            await taskController.findById(req as Request, res as Response);

            expect(taskService.findById).toHaveBeenCalledWith('1');
            expect(ApiResponse.success).toHaveBeenCalledWith(res, task);
        });

        it('should return 404 if task not found', async () => {
            req.params!.id = '1';
            taskService.findById.mockResolvedValue(null);

            await taskController.findById(req as Request, res as Response);

            expect(ApiResponse.notFound).toHaveBeenCalledWith(res, 'Task with id 1 not found');
        });

        it('should handle errors', async () => {
            const error = new Error('Test Error');
            taskService.findById.mockRejectedValue(error);

            await taskController.findById(req as Request, res as Response);

            expect(ApiResponse.error).toHaveBeenCalledWith(res, error);
        });
    });

    describe('update', () => {
        it('should update a task and return the updated task', async () => {
            const updateDto: UpdateTaskDTO = { id: '1', title: 'Updated Task', user_id: '12345' };
            req.params!.id = '1';
            req.body = { title: 'Updated Task', user_id: '12345' };
            taskService.update.mockResolvedValue(updateDto);

            await taskController.update(req as Request, res as Response);

            expect(taskService.update).toHaveBeenCalledWith(updateDto);
            expect(ApiResponse.success).toHaveBeenCalledWith(res, updateDto);
        });

        it('should handle errors', async () => {
            const error = new Error('Test Error');
            taskService.update.mockRejectedValue(error);

            await taskController.update(req as Request, res as Response);

            expect(ApiResponse.error).toHaveBeenCalledWith(res, error);
        });
    });

    describe('delete', () => {
        it('should delete a task and return success message', async () => {
            req.params!.id = '1';
            taskService.delete.mockResolvedValue();

            await taskController.delete(req as Request, res as Response);

            expect(taskService.delete).toHaveBeenCalledWith('1');
            expect(ApiResponse.success).toHaveBeenCalledWith(res, { message: 'Task deleted successfully' });
        });

        it('should handle errors', async () => {
            const error = new Error('Test Error');
            taskService.delete.mockRejectedValue(error);

            await taskController.delete(req as Request, res as Response);

            expect(ApiResponse.error).toHaveBeenCalledWith(res, error);
        });
    });
});
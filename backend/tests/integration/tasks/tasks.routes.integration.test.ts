import request from 'supertest';
import express from 'express';
import { TaskController } from '../../../src/tasks/controller/task.controller';
import { TaskService } from '../../../src/tasks/service/task.service';
import { TaskRepository } from '../../../src/tasks/repository/task.repository';
import { configureTaskRoutes } from '../../../src/tasks/routes/task.routes';
import { ApiResponse } from '../../../src/shared/responses/api-response';
import { CreateTaskDTO } from '../../../src/tasks/models/dtos/create-task.dto';

describe('Task Routes', () => {
    let app: express.Application;
    let taskRepository: jest.Mocked<TaskRepository>;
    let taskService: TaskService;
    let taskController: TaskController;

    beforeEach(() => {
        app = express();
        app.use(express.json());

        taskRepository = {
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        } as unknown as jest.Mocked<TaskRepository>;

        taskService = new TaskService(taskRepository);
        taskController = new TaskController(taskService);

        jest.spyOn(ApiResponse, 'created').mockImplementation((res, data) => res.status(201).json(data));
        jest.spyOn(ApiResponse, 'success').mockImplementation((res, data) => res.status(200).json(data));
        jest.spyOn(ApiResponse, 'error').mockImplementation((res, error, statusCode) => {
            const err = error as Error;
            return res.status(statusCode || 500).json({ error: err.message });
        });
        jest.spyOn(ApiResponse, 'notFound').mockImplementation((res, message, errorCode) => res.status(404).json({ message, errorCode }));

        app.use('/tasks', configureTaskRoutes(taskController));
    });

    describe('POST /tasks', () => {
        it('should return 201 and the created task', async () => {
            const newTask: CreateTaskDTO = { title: 'Test Task', description: 'Test Description', user_id: '1' };
            taskRepository.create.mockResolvedValue({ id: '1', ...newTask });

            const response = await request(app)
                .post('/tasks')
                .send(newTask);

            expect(response.status).toBe(201);
            expect(response.body).toEqual({ id: '1', ...newTask });
        });

        it('should return 400 for missing title', async () => {
            const newTask: CreateTaskDTO = { title: '', description: 'Test Description', user_id: '1' };
            const response = await request(app)
                .post('/tasks')
                .send(newTask);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('status', 'error');
            expect(response.body).toHaveProperty('message', 'Validation failed');
        });
    });

    describe('GET /tasks/:id', () => {
        it('should return 200 and the task when found', async () => {
            const task = { id: '1', title: 'Test Task', description: 'Test Description', user_id: '1', creation_date: new Date(), completed: false };
            taskRepository.findById.mockResolvedValue(task);

            const response = await request(app).get('/tasks/1');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(task);
        });

        it('should return 404 for non-existing task', async () => {
            taskRepository.findById.mockResolvedValue(null);

            const response = await request(app).get('/tasks/1');

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'Task not found');
        });
    });

    describe('PUT /tasks/:id', () => {
        it('should return 200 and the updated task', async () => {
            const updatedTask = { id: '1', title: 'Test Task', description: 'Test Description', user_id: '1', creation_date: new Date(), completed: false };
            taskRepository.findById.mockResolvedValue({ id: '1', title: 'Test Task', description: 'Test Description', user_id: '1', creation_date: new Date(), completed: false });
            taskRepository.update.mockResolvedValue(updatedTask);

            const response = await request(app)
                .put('/tasks/1')
                .send({ title: 'Updated Task', description: 'Updated Description', completed: false });

            expect(response.status).toBe(200);
            expect(response.body).toEqual(updatedTask);
        });

        it('should return 404 for non-existing task', async () => {
            taskRepository.findById.mockResolvedValue(null);

            const response = await request(app)
                .put('/tasks/1')
                .send({ title: 'Updated Task', description: 'Updated Description', status: 'completed' });

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'Task not found');
        });
    });

    describe('DELETE /tasks/:id', () => {
        it('should return 200 when task is deleted', async () => {
            taskRepository.findById.mockResolvedValue({ id: '1', title: 'Test Task', description: 'Test Description', user_id: '1', creation_date: new Date(), completed: false });
            taskRepository.delete.mockResolvedValue();

            const response = await request(app).delete('/tasks/1');

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: 'Task deleted successfully' });
        });

        it('should return 404 for non-existing task', async () => {
            taskRepository.findById.mockResolvedValue(null);

            const response = await request(app).delete('/tasks/1');

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'Task not found');
        });
    });
});
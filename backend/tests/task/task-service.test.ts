import { TaskService } from "../../src/tasks/service/task.service.js";
import { TaskNotFoundException } from "../../src/tasks/exceptions/task-not-found.exception.js";
import { InvalidTaskDataException } from "../../src/tasks/exceptions/invalid-task-data.exception.js";

describe('TaskService', () => {
    let taskService: TaskService;
    let mockTaskRepository: any;

    const mockTask = {
        id: '1',
        title: 'Test Task',
        description: 'Test Description',
        completed: false,
        user_id: '1',
        created_at: new Date(),
        updated_at: new Date()
    };

    beforeEach(() => {
        mockTaskRepository = {
            create: jest.fn(),
            findById: jest.fn(),
            findAllByUserId: jest.fn(),
            update: jest.fn(),
            toggleCompleted: jest.fn(),
            delete: jest.fn()
        };
        taskService = new TaskService(mockTaskRepository);
    });

    describe('create', () => {
        it('should create task successfully', async () => {
            mockTaskRepository.create.mockResolvedValue(mockTask);

            const result = await taskService.create({
                title: 'Test Task',
                description: 'Test Description',
                user_id: '1'
            });

            expect(result).toEqual(mockTask);
        });

        it('should throw InvalidTaskDataException when input is invalid', async () => {
            mockTaskRepository.create.mockRejectedValue(
                new InvalidTaskDataException('Invalid task data')
            );

            await expect(taskService.create({
                title: 'Test Task',
                description: 'Test Description',
                user_id: '1'
            })).rejects.toThrow(InvalidTaskDataException);
        });
    });

    describe('findById', () => {
        it('should find task by id', async () => {
            mockTaskRepository.findById.mockResolvedValue(mockTask);

            const result = await taskService.findById('1');

            expect(result).toEqual(mockTask);
        });

        it('should return null when task not found', async () => {
            mockTaskRepository.findById.mockResolvedValue(null);

            const result = await taskService.findById('999');

            expect(result).toBeNull();
        });
    });

    describe('findAllByUserId', () => {
        it('should return all tasks for user', async () => {
            mockTaskRepository.findAllByUserId.mockResolvedValue([mockTask]);

            const result = await taskService.findAllByUserId('1');

            expect(result).toEqual([mockTask]);
        });

        it('should throw TaskNotFoundException when no tasks found', async () => {
            mockTaskRepository.findAllByUserId.mockRejectedValue(
                new TaskNotFoundException('999')
            );

            await expect(taskService.findAllByUserId('999'))
                .rejects.toThrow(TaskNotFoundException);
        });
    });

    describe('toggleCompleted', () => {
        it('should toggle task completion status', async () => {
            const toggledTask = { ...mockTask, completed: true };
            mockTaskRepository.toggleCompleted.mockResolvedValue(toggledTask);

            const result = await taskService.toggleCompleted('1');

            expect(result).toEqual(toggledTask);
        });

        it('should throw TaskNotFoundException when task not found', async () => {
            mockTaskRepository.toggleCompleted.mockRejectedValue(
                new TaskNotFoundException('999')
            );

            await expect(taskService.toggleCompleted('999'))
                .rejects.toThrow(TaskNotFoundException);
        });
    });
}); 
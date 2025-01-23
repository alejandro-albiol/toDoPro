import { TaskController } from "../../src/tasks/controller/task-controller";
import { TaskNotFoundException } from "../../src/tasks/exceptions/task-not-found.exception";
import { InvalidTaskDataException } from "../../src/tasks/exceptions/invalid-task-data.exception";
import { TaskCreationFailedException } from "../../src/tasks/exceptions/task-creation-failed.exception";

describe('TaskController', () => {
    let taskController: TaskController;
    let mockTaskService: any;

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
        mockTaskService = {
            create: jest.fn(),
            findById: jest.fn(),
            findAllByUserId: jest.fn(),
            update: jest.fn(),
            toggleCompleted: jest.fn(),
            delete: jest.fn()
        };
        taskController = new TaskController(mockTaskService);
    });

    describe('create', () => {
        it('should create task successfully', async () => {
            mockTaskService.create.mockResolvedValue(mockTask);

            const result = await taskController.create({
                title: 'Test Task',
                description: 'Test Description',
                user_id: '1'
            });

            expect(result).toEqual(mockTask);
            expect(mockTaskService.create).toHaveBeenCalledWith({
                title: 'test task',
                description: 'test description',
                user_id: '1'
            });
        });

        it('should throw InvalidTaskDataException when task data is missing', async () => {
            await expect(taskController.create(null as any))
                .rejects.toThrow(InvalidTaskDataException);
        });

        it('should throw TaskCreationFailedException when service returns null', async () => {
            mockTaskService.create.mockResolvedValue(null);

            await expect(taskController.create({
                title: 'Test Task',
                description: 'Test Description',
                user_id: '1'
            })).rejects.toThrow(TaskCreationFailedException);
        });
    });

    describe('findById', () => {
        it('should find task by id', async () => {
            mockTaskService.findById.mockResolvedValue(mockTask);

            const result = await taskController.findById('1');

            expect(result).toEqual(mockTask);
        });

        it('should throw TaskNotFoundException when task not found', async () => {
            mockTaskService.findById.mockResolvedValue(null);

            await expect(taskController.findById('999'))
                .rejects.toThrow(TaskNotFoundException);
        });
    });

    describe('findAllByUserId', () => {
        it('should return all tasks for user', async () => {
            mockTaskService.findAllByUserId.mockResolvedValue([mockTask]);

            const result = await taskController.findAllByUserId('1');

            expect(result).toEqual([mockTask]);
        });

        it('should throw TaskNotFoundException when service throws', async () => {
            mockTaskService.findAllByUserId.mockRejectedValue(
                new TaskNotFoundException('999')
            );

            await expect(taskController.findAllByUserId('999'))
                .rejects.toThrow(TaskNotFoundException);
        });
    });

    describe('toggleCompleted', () => {
        it('should toggle task completion status', async () => {
            const toggledTask = { ...mockTask, completed: true };
            mockTaskService.toggleCompleted.mockResolvedValue(toggledTask);

            const result = await taskController.toggleCompleted('1');

            expect(result).toEqual(toggledTask);
        });

        it('should throw TaskNotFoundException when task not found', async () => {
            mockTaskService.toggleCompleted.mockRejectedValue(
                new TaskNotFoundException('999')
            );

            await expect(taskController.toggleCompleted('999'))
                .rejects.toThrow(TaskNotFoundException);
        });
    });
}); 
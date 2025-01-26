import { DataBaseException } from "../../src/shared/models/exceptions/data-base.exception.js";
import { TaskRepository } from "../../src/tasks/repository/task.repository.js";
import { mockPool } from "../__mocks__/database-mock.js";
import { DataBaseErrorCode } from "../../src/shared/models/exceptions/enums/data-base-error-code.enum.js";

describe('TaskRepository', () => {
    let taskRepository: TaskRepository;
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
        taskRepository = new TaskRepository();
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create task successfully', async () => {
            mockPool.query.mockResolvedValueOnce({ rows: [mockTask] });

            const result = await taskRepository.create({
                title: 'Test Task',
                description: 'Test Description',
                user_id: '1'
            });

            expect(result).toEqual(mockTask);
        });

        it('should throw UNIQUE_VIOLATION when duplicate task', async () => {
            mockPool.query.mockRejectedValueOnce({
                code: DataBaseErrorCode.UNIQUE_VIOLATION,
                constraint: 'unique_title',
                detail: 'Task title already exists'
            });

            await expect(taskRepository.create({
                title: 'Test Task',
                description: 'Test Description',
                user_id: '1'
            })).rejects.toThrow(DataBaseException);
        });

        it('should throw NOT_NULL_VIOLATION when missing required field', async () => {
            mockPool.query.mockRejectedValueOnce({
                code: DataBaseErrorCode.NOT_NULL_VIOLATION,
                constraint: 'not_null_title',
                detail: 'Title is required'
            });

            await expect(taskRepository.create({
                description: 'Test Description',
                user_id: '1'
            } as any)).rejects.toThrow(DataBaseException);
        });
    });

    describe('findById', () => {
        it('should find task by id', async () => {
            mockPool.query.mockResolvedValueOnce({ rows: [mockTask] });

            const result = await taskRepository.findById('1');

            expect(result).toEqual(mockTask);
        });

        it('should return null when task not found', async () => {
            mockPool.query.mockResolvedValueOnce({ rows: [] });

            const result = await taskRepository.findById('999');

            expect(result).toBeNull();
        });
    });

    describe('findAllByUserId', () => {
        it('should return all tasks for user', async () => {
            mockPool.query.mockResolvedValueOnce({ rows: [mockTask] });

            const result = await taskRepository.findAllByUserId('1');

            expect(result).toEqual([mockTask]);
        });

        it('should return empty array when no tasks found', async () => {
            mockPool.query.mockResolvedValueOnce({ rows: [] });

            const result = await taskRepository.findAllByUserId('999');

            expect(result).toEqual([]);
        });
    });

    describe('toggleCompleted', () => {
        it('should toggle task completion status', async () => {
            const toggledTask = { ...mockTask, completed: true };
            mockPool.query.mockResolvedValueOnce({ rows: [toggledTask] });

            const result = await taskRepository.toggleCompleted('1');

            expect(result).toEqual(toggledTask);
        });

        it('should throw when task not found', async () => {
            mockPool.query.mockRejectedValueOnce({
                code: DataBaseErrorCode.NOT_FOUND
            });

            await expect(taskRepository.toggleCompleted('999'))
                .rejects.toThrow(DataBaseException);
        });
    });
});
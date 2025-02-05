import { TaskException } from '../../../../src/tasks/exceptions/base-task.exception.js';
import { TaskNotFoundException } from '../../../../src/tasks/exceptions/task-not-found.exception.js';
import { TaskErrorCodes } from '../../../../src/tasks/exceptions/enums/task-error-codes.enum.js';
import { InvalidTaskDataException } from '../../../../src/tasks/exceptions/invalid-task-data.exception.js';

class TestTaskException extends TaskException {
    constructor(message: string) {
        super(message, 500, TaskErrorCodes.UNKNOWN_ERROR);
    }
}

describe('TaskException', () => {
    it('should create base exception with default values', () => {
        const exception = new TestTaskException('Test error');
        
        expect(exception.message).toBe('Test error');
        expect(exception.name).toBe('TestTaskException');
        expect(exception.errorCode).toBe(TaskErrorCodes.UNKNOWN_ERROR);
        expect(exception.statusCode).toBe(500);
    });

    it('should create TaskNotFoundException with correct format', () => {
        const taskId = 'task-123';
        const exception = new TaskNotFoundException(taskId);
        
        expect(exception.message).toBe(`Task with id '${taskId}' not found`);
        expect(exception.name).toBe('TaskNotFoundException');
        expect(exception.errorCode).toBe(TaskErrorCodes.TASK_NOT_FOUND);
        expect(exception.statusCode).toBe(404);
    });

    it('should create InvalidTaskDataException with correct values', () => {
        const errorMessage = 'Invalid task data';
        const exception = new InvalidTaskDataException(errorMessage);
        
        expect(exception.message).toBe(errorMessage);
        expect(exception.name).toBe('InvalidTaskDataException');
        expect(exception.errorCode).toBe(TaskErrorCodes.INVALID_TASK_DATA);
        expect(exception.statusCode).toBe(400);
    });
}); 
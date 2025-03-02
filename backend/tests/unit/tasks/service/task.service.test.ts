import { TaskService } from '../../../../src/tasks/service/task.service';
import { ITaskRepository } from '../../../../src/tasks/repository/i-task.repository';
import { CreateTaskDTO } from '../../../../src/tasks/models/dtos/create-task.dto';
import { UpdateTaskDTO } from '../../../../src/tasks/models/dtos/update-task.dto';
import { Task } from '../../../../src/tasks/models/entities/task.entity';
import { TaskNotFoundException } from '../../../../src/tasks/exceptions/task-not-found.exception';
import { InvalidTaskDataException } from '../../../../src/tasks/exceptions/invalid-task-data.exception';
import { TaskCreationFailedException } from '../../../../src/tasks/exceptions/task-creation-failed.exception';

describe('TaskService', () => {
  let taskService: TaskService;
  let mockTaskRepository: jest.Mocked<ITaskRepository>;

  beforeEach(() => {
    mockTaskRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findAllByUserId: jest.fn(),
      findAllCompletedByUserId: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      toggleCompleted: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<ITaskRepository>;

    taskService = new TaskService(mockTaskRepository);
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const newTask: CreateTaskDTO = { title: 'Test Task', description: 'Test Description', user_id: '1' };
      const createdTask: Partial<Task> = { id: '1', ...newTask, completed: false };

      mockTaskRepository.create.mockResolvedValue(createdTask);

      const result = await taskService.create(newTask);

      expect(mockTaskRepository.create).toHaveBeenCalledWith(newTask);
      expect(result).toEqual(createdTask);
    });

    it('should handle invalid task data', async () => {
      const newTask: CreateTaskDTO = { title: 'Test Task', description: 'Test Description', user_id: '1' };
      const error = new InvalidTaskDataException('Invalid task format');

      mockTaskRepository.create.mockRejectedValue(error);

      await expect(taskService.create(newTask)).rejects.toThrow(InvalidTaskDataException);
      expect(mockTaskRepository.create).toHaveBeenCalledWith(newTask);
    });

    it('should handle task creation failure', async () => {
      const newTask: CreateTaskDTO = { title: 'Test Task', description: 'Test Description', user_id: '1' };
      const error = new Error('Database error');

      mockTaskRepository.create.mockRejectedValue(error);

      await expect(taskService.create(newTask)).rejects.toThrow(TaskCreationFailedException);
      expect(mockTaskRepository.create).toHaveBeenCalledWith(newTask);
    });
  });

  describe('findAll', () => {
    it('should return all tasks', async () => {
      const tasks: Task[] = [
        { id: '1', title: 'Task 1', description: 'Description 1', completed: false, user_id: '1', creation_date: new Date(), completed_at: new Date() },
        { id: '2', title: 'Task 2', description: 'Description 2', completed: false, user_id: '1', creation_date: new Date(), completed_at: new Date() },
      ];

      mockTaskRepository.findAll.mockResolvedValue(tasks);

      const result = await taskService.findAll();

      expect(mockTaskRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(tasks);
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');

      mockTaskRepository.findAll.mockRejectedValue(error);

      await expect(taskService.findAll()).rejects.toThrow(InvalidTaskDataException);
      expect(mockTaskRepository.findAll).toHaveBeenCalled();
    });
  });

  describe('findAllByUserId', () => {
    it('should return tasks by user id', async () => {
      const tasks: Task[] = [
        { id: '1', title: 'Task 1', description: 'Description 1', completed: false, user_id: '1', creation_date: new Date(), completed_at: new Date() },
        { id: '2', title: 'Task 2', description: 'Description 2', completed: false, user_id: '1', creation_date: new Date(), completed_at: new Date() },
      ];

      mockTaskRepository.findAllByUserId.mockResolvedValue(tasks);

      const result = await taskService.findAllByUserId('1');

      expect(mockTaskRepository.findAllByUserId).toHaveBeenCalledWith('1');
      expect(result).toEqual(tasks);
    });

    it('should return null if tasks not found', async () => {
      mockTaskRepository.findAllByUserId.mockResolvedValue(null);

      const result = await taskService.findAllByUserId('1');

      expect(mockTaskRepository.findAllByUserId).toHaveBeenCalledWith('1');
      expect(result).toBeNull();
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');

      mockTaskRepository.findAllByUserId.mockRejectedValue(error);

      await expect(taskService.findAllByUserId('1')).rejects.toThrow(InvalidTaskDataException);
      expect(mockTaskRepository.findAllByUserId).toHaveBeenCalledWith('1');
    });
  });

  describe('findAllCompletedByUserId', () => {
    it('should return completed tasks by user id', async () => {
      const tasks: Task[] = [
        { id: '1', title: 'Task 1', description: 'Description 1', completed: true, user_id: '1', creation_date: new Date(), completed_at: new Date() },
        { id: '2', title: 'Task 2', description: 'Description 2', completed: true, user_id: '1', creation_date: new Date(), completed_at: new Date() },
      ];

      mockTaskRepository.findAllCompletedByUserId.mockResolvedValue(tasks);

      const result = await taskService.findAllCompletedByUserId('1');

      expect(mockTaskRepository.findAllCompletedByUserId).toHaveBeenCalledWith('1');
      expect(result).toEqual(tasks);
    });

    it('should return null if completed tasks not found', async () => {
      mockTaskRepository.findAllCompletedByUserId.mockResolvedValue(null);

      const result = await taskService.findAllCompletedByUserId('1');

      expect(mockTaskRepository.findAllCompletedByUserId).toHaveBeenCalledWith('1');
      expect(result).toBeNull();
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');

      mockTaskRepository.findAllCompletedByUserId.mockRejectedValue(error);

      await expect(taskService.findAllCompletedByUserId('1')).rejects.toThrow(InvalidTaskDataException);
      expect(mockTaskRepository.findAllCompletedByUserId).toHaveBeenCalledWith('1');
    });
  });

  describe('findById', () => {
    it('should return a task by id', async () => {
      const task: Task = { id: '1', title: 'Task 1', description: 'Description 1', completed: false, user_id: '1', creation_date: new Date(), completed_at: new Date() };

      mockTaskRepository.findById.mockResolvedValue(task);

      const result = await taskService.findById('1');

      expect(mockTaskRepository.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(task);
    });

    it('should return null if task not found', async () => {
      mockTaskRepository.findById.mockResolvedValue(null);

      const result = await taskService.findById('1');

      expect(mockTaskRepository.findById).toHaveBeenCalledWith('1');
      expect(result).toBeNull();
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');

      mockTaskRepository.findById.mockRejectedValue(error);

      await expect(taskService.findById('1')).rejects.toThrow(InvalidTaskDataException);
      expect(mockTaskRepository.findById).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const updatedTask: UpdateTaskDTO = { id: '1', title: 'Updated Task', description: 'Updated Description', user_id: '1' };
      const task: Task = { id: '1', title: 'Updated Task', description: 'Updated Description', completed: false, user_id: '1', creation_date: new Date(), completed_at: new Date() };

      mockTaskRepository.findById.mockResolvedValue(task);
      mockTaskRepository.update.mockResolvedValue(task);

      const result = await taskService.update(updatedTask);

      expect(mockTaskRepository.findById).toHaveBeenCalledWith(updatedTask.id);
      expect(mockTaskRepository.update).toHaveBeenCalledWith(updatedTask);
      expect(result).toEqual(task);
    });

    it('should throw TaskNotFoundException if task not found', async () => {
      const updatedTask: UpdateTaskDTO = { id: '1', title: 'Updated Task', description: 'Updated Description', user_id: '1' };

      mockTaskRepository.findById.mockResolvedValue(null);

      await expect(taskService.update(updatedTask)).rejects.toThrow(TaskNotFoundException);
      expect(mockTaskRepository.findById).toHaveBeenCalledWith(updatedTask.id);
    });

    it('should handle errors', async () => {
      const updatedTask: UpdateTaskDTO = { id: '1', title: 'Updated Task', description: 'Updated Description', user_id: '1' };
      const error = new Error('Database error');

      mockTaskRepository.findById.mockResolvedValue({ id: '1', title: 'Task 1', description: 'Description 1', completed: false, user_id: '1' });
      mockTaskRepository.update.mockRejectedValue(error);

      await expect(taskService.update(updatedTask)).rejects.toThrow(InvalidTaskDataException);
      expect(mockTaskRepository.findById).toHaveBeenCalledWith(updatedTask.id);
      expect(mockTaskRepository.update).toHaveBeenCalledWith(updatedTask);
    });
  });

  describe('toggleCompleted', () => {
    it('should toggle the completed status of a task', async () => {
      const task: Task = { id: '1', title: 'Task 1', description: 'Description 1', completed: false, user_id: '1', creation_date: new Date(), completed_at: new Date() };

      mockTaskRepository.toggleCompleted.mockResolvedValue();

      await taskService.toggleCompleted('1');

      expect(mockTaskRepository.toggleCompleted).toHaveBeenCalledWith('1');
    });

    it('should throw TaskNotFoundException if task not found', async () => {
      const error = new TaskNotFoundException('1');

      mockTaskRepository.toggleCompleted.mockRejectedValue(error);

      await expect(taskService.toggleCompleted('1')).rejects.toThrow(TaskNotFoundException);
      expect(mockTaskRepository.toggleCompleted).toHaveBeenCalledWith('1');
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');

      mockTaskRepository.toggleCompleted.mockRejectedValue(error);

      await expect(taskService.toggleCompleted('1')).rejects.toThrow(InvalidTaskDataException);
      expect(mockTaskRepository.toggleCompleted).toHaveBeenCalledWith('1');
    });
  });

  describe('delete', () => {
    it('should delete a task', async () => {
      mockTaskRepository.delete.mockResolvedValue(undefined);
      const task = { id: '1', title: 'Task 1', description: 'Description 1', completed: false, user_id: '1', creation_date: new Date(), completed_at: new Date() };
      taskService.findById = jest.fn().mockResolvedValue(task);
      const result = await taskService.delete(task.id);
      expect(result).toBe(undefined);

    });

    it('should throw TaskNotFoundException if task not found', async () => {
      const error = new TaskNotFoundException('1');

      mockTaskRepository.delete.mockRejectedValue(error);
      await expect(taskService.delete('1')).rejects.toThrow(TaskNotFoundException);
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');

      mockTaskRepository.delete.mockRejectedValue(error);

      await expect(taskService.delete('1')).rejects.toThrow(TaskNotFoundException);
    });
  });
});
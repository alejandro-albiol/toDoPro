import { ITaskRepository } from '../repository/i-task.repository.js';
import { ITaskService } from './i-task.service.js';
import { Task } from '../models/entities/task.entity.js';
import { CreateTaskDTO } from '../models/dtos/create-task.dto.js';
import { UpdateTaskDTO } from '../models/dtos/update-task.dto.js';
import { TaskNotFoundException } from '../exceptions/task-not-found.exception.js';
import { InvalidTaskDataException } from '../exceptions/invalid-task-data.exception.js';
import { TaskCreationFailedException } from '../exceptions/task-creation-failed.exception.js';

export class TaskService implements ITaskService {
  constructor(private taskRepository: ITaskRepository) {}

  async create(dto: CreateTaskDTO): Promise<Partial<Task>> {
    try {
      return await this.taskRepository.create(dto);
    } catch (error) {
      if (error instanceof InvalidTaskDataException) {
        throw new InvalidTaskDataException('Invalid task format');
      }
      throw new TaskCreationFailedException(
        'Error creating task: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
      );
    }
  }

  async findAll(): Promise<Task[] | null> {
    try {
      return await this.taskRepository.findAll();
    } catch (error) {
      throw new InvalidTaskDataException(
        'Error finding tasks: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
      );
    }
  }

  async findAllByUserId(userId: string): Promise<Task[] | null> {
    try {
      const tasks = await this.taskRepository.findAllByUserId(userId);
      return tasks ? tasks : null;
    } catch (error) {
      if (error instanceof TaskNotFoundException) {
        return null;
      }
      throw new InvalidTaskDataException(
        'Error finding tasks: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
      );
    }
  }

  async findAllCompletedByUserId(userId: string): Promise<Task[] | null> {
    try {
      const tasks = await this.taskRepository.findAllCompletedByUserId(userId);
      return tasks ? tasks : null;
    } catch (error) {
      if (error instanceof TaskNotFoundException) {
        return null;
      }
      throw new InvalidTaskDataException(
        'Error finding completed tasks: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
      );
    }
  }

  async findById(id: string): Promise<Partial<Task> | null> {
    try {
      const task = await this.taskRepository.findById(id);
      return task ? task : null;
    } catch (error) {
      if (error instanceof TaskNotFoundException) {
        return null;
      }
      throw new InvalidTaskDataException(
        'Error finding task: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
      );
    }
  }

  async update(updatedTask: UpdateTaskDTO): Promise<Partial<Task>> {
    try {
      const task = await this.taskRepository.findById(updatedTask.id);
      if (!task) {
        throw new TaskNotFoundException(updatedTask.id);
      }
      const updatedTaskResult = await this.taskRepository.update(updatedTask);
      return updatedTaskResult;
    } catch (error) {
      if (error instanceof TaskNotFoundException) {
        throw error;
      }
      throw new InvalidTaskDataException(
        'Error updating task: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
      );
    }
  }

  async toggleCompleted(id: string): Promise<void> {
    try {
      await this.taskRepository.toggleCompleted(id);
    } catch (error) {
      if (error instanceof TaskNotFoundException) {
        throw error;
      }
      throw new InvalidTaskDataException(
        'Error toggling task completion: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
      );
    }
  }

  async delete(id: string): Promise<void> {
    const task = await this.findById(id);
    if (!task) {
      throw new TaskNotFoundException(id);
    }

    try {
      await this.taskRepository.delete(id);
    } catch (error) {
      if (error instanceof TaskNotFoundException) {
        throw new TaskNotFoundException(id);
      }
      throw new InvalidTaskDataException(
        'Error deleting task: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
      );
    }
  }
}

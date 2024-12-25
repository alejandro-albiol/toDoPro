import { pool } from '../../config/configDataBase';
import { TaskStatsDto } from '../interfaces/dtos/task/TaskStatsDto';
import { Task } from '../../models/entities/Task';
import { CreateTaskDto } from '../interfaces/dtos/task/CreateTaskDto';
import { UpdateTaskDto } from '../interfaces/dtos/task/UpdateTaskDto';
import { ITaskRepository } from '../interfaces/repositories/ITaskRepository';
import { TaskValidationException } from '../../models/exceptions/validation/task/TaskValidationException';
import { TaskNotFoundException } from '../../models/exceptions/notFound/task/TaskNotFoundException';
import { DataBaseException } from '../exceptions/DataBaseException';

export class TaskServices {
  private taskRepository: ITaskRepository;

  constructor(taskRepository: ITaskRepository) {
    this.taskRepository = taskRepository;
  }

  async createTask(taskDto: CreateTaskDto): Promise<Task> {
    try {
      return this.taskRepository.create(taskDto);
    } catch (error) {
      throw new TaskValidationException('create');
    }
  }
  async updateTask(id: string, taskToUpdate: UpdateTaskDto): Promise<Task> {
    const existingTask = await this.taskRepository.findById(id);
    if (!existingTask) {
      throw new TaskNotFoundException(id);
    }
    return await this.taskRepository.update(id, taskToUpdate);
  }
  async deleteTask(id: string): Promise<boolean> {
    const existingTask = await this.taskRepository.findById(id);
    if (!existingTask) {
      throw new TaskNotFoundException(id);
    }

    return await this.taskRepository.delete(id);
  }
}

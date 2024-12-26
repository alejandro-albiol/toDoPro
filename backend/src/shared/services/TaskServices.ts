import { pool } from '../../config/configDataBase';
import { TaskStatsDto } from '../../tasks/models/dtos/TaskStatsDto';
import { Task } from '../../tasks/models/entities/Task';
import { CreateTaskDto } from '../../tasks/models/dtos/CreateTaskDto';
import { UpdateTaskDto } from '../../tasks/models/dtos/UpdateTaskDto';
import { ITaskRepository } from '../../tasks/repository/ITaskRepository';
import { TaskValidationException } from '../models/exceptions/validation/task/TaskValidationException';
import { TaskNotFoundException } from '../models/exceptions/notFound/task/TaskNotFoundException';
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

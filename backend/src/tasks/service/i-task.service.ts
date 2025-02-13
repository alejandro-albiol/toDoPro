import { IBaseService } from '../../shared/models/interfaces/base/i-service.js';
import { Task } from '../models/entities/task.entity.js';
import { CreateTaskDTO } from '../models/dtos/create-task.dto.js';
import { UpdateTaskDTO } from '../models/dtos/update-task.dto.js';

export interface ITaskService extends IBaseService<Task, CreateTaskDTO, UpdateTaskDTO> {
  findAllByUserId(userId: string): Promise<Task[]>;
  toggleCompleted(id: string): Promise<void>;
  findAllCompletedByUserId(userId: string): Promise<Task[]>;
}

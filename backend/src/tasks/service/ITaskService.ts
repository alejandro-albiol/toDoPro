import { IBaseService } from '../../shared/interfaces/base/IBaseService.js';
import { Task } from '../models/entities/Task.js';
import { CreateTaskDTO } from '../models/dtos/CreateTaskDTO.js';
import { UpdateTaskDTO } from '../models/dtos/UpdateTaskDTO.js';
import { UpdatedTaskDTO } from '../models/dtos/UpdatedTaskDTO.js';

export interface ITaskService extends IBaseService<Task, CreateTaskDTO, UpdateTaskDTO, UpdatedTaskDTO> {
  findAllByUserId(userId: string): Promise<Task[]>;
  toggleCompleted(id: string): Promise<Task>;
}

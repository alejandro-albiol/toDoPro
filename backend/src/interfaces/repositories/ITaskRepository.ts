import { IBaseRepository } from './base/IBaseRepository.js';
import { Task } from '../../models/entities/Task.js';
import { CreateTaskDto } from '../dtos/task/CreateTaskDto.js';

export interface ITaskRepository extends IBaseRepository<Task, CreateTaskDto> {}

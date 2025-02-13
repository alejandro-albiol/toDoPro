import { IBaseRepository } from "../../shared/models/interfaces/base/i-repository.js";
import { CreateTaskDTO } from "../models/dtos/create-task.dto.js";
import { UpdatedTaskDTO } from "../models/dtos/updated-task.dto.js";
import { UpdateTaskDTO } from "../models/dtos/update-task.dto.js";
import { Task } from "../models/entities/task.entity.js";

export interface ITaskRepository extends IBaseRepository<Task, CreateTaskDTO, UpdateTaskDTO>{
  toggleCompleted(id: string): Promise<Task>;
  findAllByUserId(userId: string): Promise<Task[]>;
}
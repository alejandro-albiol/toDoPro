import { IBaseRepository } from "../../shared/interfaces/base/IBaseRepository.js";
import { CreateTaskDTO } from "../models/dtos/CreateTaskDTO.js";
import { UpdatedTaskDTO } from "../models/dtos/UpdatedTaskDTO.js";
import { UpdateTaskDTO } from "../models/dtos/UpdateTaskDTO.js";
import { Task } from "../models/entities/Task.js";

export interface ITaskRepository extends IBaseRepository<Task, CreateTaskDTO, UpdateTaskDTO, UpdatedTaskDTO>{
  toggleCompleted(id: string): Promise<Task>;
  findAllByUserId(userId: string): Promise<Task[]>;
}
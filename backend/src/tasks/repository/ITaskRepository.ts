import { IBaseRepository } from "../../shared/interfaces/base/IBaseRepository";
import { CreateTaskDTO } from "../models/dtos/CreateTaskDTO";
import { UpdatedTaskDTO } from "../models/dtos/UpdatedTaskDTO";
import { UpdateTaskDTO } from "../models/dtos/UpdateTaskDTO";
import { Task } from "../models/entities/Task";

export interface ITaskRepository extends IBaseRepository<Task, CreateTaskDTO, UpdateTaskDTO, UpdatedTaskDTO>{
  toggleCompleted(id: string): Promise<Task>;
  findAllByUserId(userId: string): Promise<Task[]>;
}
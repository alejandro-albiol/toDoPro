import { IBaseController } from "../../shared/interfaces/base/IBaseController.js";
import { Task } from "../models/entities/Task.js";
import { CreateTaskDTO } from "../models/dtos/CreateTaskDTO.js";
import { UpdateTaskDTO } from "../models/dtos/UpdateTaskDTO.js";
import { UpdatedTaskDTO } from "../models/dtos/UpdatedTaskDTO.js";

export interface ITaskController extends IBaseController<Task, CreateTaskDTO, UpdateTaskDTO, UpdatedTaskDTO> {
  toggleCompleted(id: string): Promise<Task>;
  findAllByUserId(userId: string): Promise<Task[]>;
}
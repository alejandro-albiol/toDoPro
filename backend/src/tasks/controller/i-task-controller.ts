import { IBaseController } from "../../shared/models/interfaces/base/i-controller.js";
import { Task } from "../models/entities/task.entity.js";
import { CreateTaskDTO } from "../models/dtos/create-task.dto.js";
import { UpdateTaskDTO } from "../models/dtos/update-task.dto.js";
import { UpdatedTaskDTO } from "../models/dtos/updated-task.dto.js";

export interface ITaskController extends IBaseController<Task, CreateTaskDTO, UpdateTaskDTO, UpdatedTaskDTO> {
  toggleCompleted(id: string): Promise<Task>;
  findAllByUserId(userId: string): Promise<Task[]>;
}
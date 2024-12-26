import { CreateTaskDto } from "../models/dtos/CreateTaskDto";
import { UpdateTaskDto } from "../models/dtos/UpdateTaskDto";
import { Task } from "../models/entities/Task";

export interface ITaskRepository{
  findById(id: string): Promise<Task | null>;
  create(task: CreateTaskDto): Promise<Task>;
  update(updatedTask: UpdateTaskDto): Promise<Task>;
  toggleCompleted(id: string): Promise<void>;
  delete(id: string): Promise<void>;
}
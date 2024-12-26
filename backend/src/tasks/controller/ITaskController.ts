import { Task } from "../models/entities/Task";

export interface ITaskController {
  getTasks(userId: string): Promise<Task[]>;
}

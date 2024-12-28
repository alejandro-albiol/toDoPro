import { ITaskRepository } from "../repository/ITaskRepository";
import { ITaskService } from "./ITaskService";
import { Task } from "../models/entities/Task";
import { CreateTaskDTO } from "../models/dtos/CreateTaskDTO";
import { UpdateTaskDTO } from "../models/dtos/UpdateTaskDTO";
import { UpdatedTaskDTO } from "../models/dtos/UpdatedTaskDTO";

export class TaskService implements ITaskService {
    private taskRepository: ITaskRepository;

    constructor(taskRepository: ITaskRepository) {
        this.taskRepository = taskRepository;
    }

    create(newTask: CreateTaskDTO): Promise<Task> {
        return this.taskRepository.create(newTask);
    }

    findAllByUserId(userId: string): Promise<Task[]> {
        return this.taskRepository.findAllByUserId(userId);
    }   

    findById(id: string): Promise<Task | null> {
        return this.taskRepository.findById(id);
    }

    update(updatedTask: UpdateTaskDTO): Promise<UpdatedTaskDTO> {
        return this.taskRepository.update(updatedTask);
    }

    toggleCompleted(id: string): Promise<Task> {
        return this.taskRepository.toggleCompleted(id);
    }   

    delete(id: string): Promise<void> {
        return this.taskRepository.delete(id);
    }

}
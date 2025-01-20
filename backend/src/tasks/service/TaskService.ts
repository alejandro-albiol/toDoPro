import { ITaskRepository } from "../repository/ITaskRepository.js";
import { ITaskService } from "./ITaskService.js";
import { Task } from "../models/entities/Task.js";
import { CreateTaskDTO } from "../models/dtos/CreateTaskDTO.js";
import { UpdateTaskDTO } from "../models/dtos/UpdateTaskDTO.js";
import { UpdatedTaskDTO } from "../models/dtos/UpdatedTaskDTO.js";

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
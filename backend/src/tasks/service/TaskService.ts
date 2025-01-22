import { ITaskRepository } from "../repository/ITaskRepository.js";
import { ITaskService } from "./ITaskService.js";
import { Task } from "../models/entities/Task.js";
import { CreateTaskDTO } from "../models/dtos/CreateTaskDTO.js";
import { UpdateTaskDTO } from "../models/dtos/UpdateTaskDTO.js";
import { UpdatedTaskDTO } from "../models/dtos/UpdatedTaskDTO.js";
import { DataBaseException } from "../../shared/exceptions/DataBaseException.js";
import { DataBaseErrorCode } from "../../shared/exceptions/enums/DataBaseErrorCode.enum.js";
import { TaskNotFoundException } from "../exceptions/task-not-found.exception.js";
import { InvalidTaskDataException } from "../exceptions/invalid-task-data.exception.js";

export class TaskService implements ITaskService {
    private taskRepository: ITaskRepository;

    constructor(taskRepository: ITaskRepository) {
        this.taskRepository = taskRepository;
    }

    async create(newTask: CreateTaskDTO): Promise<Task> {
        try {
            return this.taskRepository.create(newTask);
        } catch (error: any) {
            if(error instanceof DataBaseException && error.code === DataBaseErrorCode.INVALID_INPUT) {
                throw new InvalidTaskDataException('Invalid task format');
            }
            throw new DataBaseException('Error creating task', DataBaseErrorCode.UNKNOWN_ERROR);
        }
    }

    async findAllByUserId(userId: string): Promise<Task[]> {
        try {
            return this.taskRepository.findAllByUserId(userId);
        } catch (error: any) {
            if(error instanceof DataBaseException && error.code === DataBaseErrorCode.NOT_FOUND) {
                throw new TaskNotFoundException('No tasks found');
            }
            throw new DataBaseException('Error finding tasks', DataBaseErrorCode.UNKNOWN_ERROR);
        }
    }   

    async findById(id: string): Promise<Task | null> {
        try {
            return this.taskRepository.findById(id);
        } catch (error: any) {
            if(error instanceof DataBaseException && error.code === DataBaseErrorCode.NOT_FOUND) {
                throw new TaskNotFoundException('No tasks found');
            }
            throw new DataBaseException('Error finding task', DataBaseErrorCode.UNKNOWN_ERROR);
        }
    }

    async update(updatedTask: UpdateTaskDTO): Promise<UpdatedTaskDTO> {
        try {
            return this.taskRepository.update(updatedTask);
        } catch (error: any) {
            if(error instanceof DataBaseException && error.code === DataBaseErrorCode.NOT_FOUND) {
                throw new TaskNotFoundException(updatedTask.id);
            }
            throw new DataBaseException('Error updating task', DataBaseErrorCode.UNKNOWN_ERROR);
        }
    }

    async toggleCompleted(id: string): Promise<Task> {
        try {
            return this.taskRepository.toggleCompleted(id);
        } catch (error: any) {
            if(error instanceof DataBaseException && error.code === DataBaseErrorCode.NOT_FOUND) {
                throw new TaskNotFoundException(id);
            }
            throw new DataBaseException('Error toggling task', DataBaseErrorCode.UNKNOWN_ERROR);
        }
    }   

    async delete(id: string): Promise<void> {
        try {
            return this.taskRepository.delete(id);
        } catch (error: any) {
            if(error instanceof DataBaseException && error.code === DataBaseErrorCode.NOT_FOUND) {
                throw new TaskNotFoundException(id);
            }
            throw new DataBaseException('Error deleting task', DataBaseErrorCode.UNKNOWN_ERROR);
        }
    }
}
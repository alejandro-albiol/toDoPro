import { ITaskRepository } from "../repository/i-task.repository.js";
import { ITaskService } from "./i-task.service.js";
import { Task } from "../models/entities/task.entity.js";
import { CreateTaskDTO } from "../models/dtos/create-task.dto.js";
import { UpdateTaskDTO } from "../models/dtos/update-task.dto.js";
import { UpdatedTaskDTO } from "../models/dtos/updated-task.dto.js";
import { DataBaseException } from "../../shared/database/exceptions/database.exception.js";
import { PostgresErrorCode } from "../../shared/exceptions/enums/db-error-code.enum.js";
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
            if(error instanceof DataBaseException && error.code === PostgresErrorCode.INVALID_INPUT) {
                throw new InvalidTaskDataException('Invalid task format');
            }
            throw new DataBaseException('Error creating task', PostgresErrorCode.UNKNOWN_ERROR);
        }
    }

    async findAllByUserId(userId: string): Promise<Task[]> {
        try {
            return this.taskRepository.findAllByUserId(userId);
        } catch (error: any) {
            if(error instanceof DataBaseException && error.code === PostgresErrorCode.NOT_FOUND) {
                throw new TaskNotFoundException('No tasks found');
            }
            throw new DataBaseException('Error finding tasks', PostgresErrorCode.UNKNOWN_ERROR);
        }
    }   

    async findById(id: string): Promise<Task | null> {
        try {
            return this.taskRepository.findById(id);
        } catch (error: any) {
            if(error instanceof DataBaseException && error.code === PostgresErrorCode.NOT_FOUND) {
                throw new TaskNotFoundException('No tasks found');
            }
            throw new DataBaseException('Error finding task', PostgresErrorCode.UNKNOWN_ERROR);
        }
    }

    async update(updatedTask: UpdateTaskDTO): Promise<UpdatedTaskDTO> {
        try {
            return this.taskRepository.update(updatedTask);
        } catch (error: any) {
            if(error instanceof DataBaseException && error.code === PostgresErrorCode.NOT_FOUND) {
                throw new TaskNotFoundException(updatedTask.id);
            }
            throw new DataBaseException('Error updating task', PostgresErrorCode.UNKNOWN_ERROR);
        }
    }

    async toggleCompleted(id: string): Promise<Task> {
        try {
            return this.taskRepository.toggleCompleted(id);
        } catch (error: any) {
            if(error instanceof DataBaseException && error.code === PostgresErrorCode.NOT_FOUND) {
                throw new TaskNotFoundException(id);
            }
            throw new DataBaseException('Error toggling task', PostgresErrorCode.UNKNOWN_ERROR);
        }
    }   

    async delete(id: string): Promise<null> {
        try {
            await this.taskRepository.delete(id);
            return null;
        } catch (error) {
            if(error instanceof DataBaseException && error.code === PostgresErrorCode.NOT_FOUND) {
                throw new TaskNotFoundException(id);
            }
            throw new DataBaseException('Error deleting task', PostgresErrorCode.UNKNOWN_ERROR);
        }
    }
}
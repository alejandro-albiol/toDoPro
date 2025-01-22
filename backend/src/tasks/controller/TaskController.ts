import { ITaskController } from "./ITaskController.js";
import { ITaskService } from "../service/ITaskService.js";
import { Task } from "../models/entities/Task.js";
import { CreateTaskDTO } from "../models/dtos/CreateTaskDTO.js";
import { UpdateTaskDTO } from "../models/dtos/UpdateTaskDTO.js";
import { UpdatedTaskDTO } from "../models/dtos/UpdatedTaskDTO.js";
import { TaskException } from "../exceptions/base-task.exception.js";
import { InvalidTaskDataException } from "../exceptions/invalid-task-data.exception.js";
import { DataBaseException } from "../../shared/exceptions/DataBaseException.js";
import { TaskNotFoundException } from "../exceptions/task-not-found.exception.js";
import { TaskCreationFailedException } from "../exceptions/task-creation-failed.exception.js";

export class TaskController implements ITaskController {
    constructor(private taskService: ITaskService){}

    async create(newTask: CreateTaskDTO): Promise<Task> {
        try {
            if (!newTask) {
                throw new InvalidTaskDataException('Task data is required');
            }
            const newTaskDto = await this.toCreateTaskDto(newTask);
            const task = await this.taskService.create(newTaskDto);
            if (!task) {
                throw new TaskCreationFailedException('Task creation failed');
            }
            return task;
        } catch (error) {
            if (error instanceof TaskException || error instanceof DataBaseException || error instanceof SyntaxError) {
                throw error;
            }
            console.error(error);
            throw new InvalidTaskDataException('An unknown error occurred');
        }
    }

    async findAllByUserId(userId: string): Promise<Task[]> {
        try {
            return this.taskService.findAllByUserId(userId);
        } catch (error) {
            throw new TaskNotFoundException(`No tasks found for user with id: ${userId}`);
        }
    }

    async findById(id: string): Promise<Task> {
        try {
            const task = await this.taskService.findById(id);
            if (!task) {
                throw new TaskNotFoundException(id);
            }
            return task;
        } catch (error) {
            throw new TaskNotFoundException(id);
        }
    }

    async toggleCompleted(id: string): Promise<Task> {
        try {
            return this.taskService.toggleCompleted(id);
        } catch (error) {
            throw new TaskNotFoundException(`Task with id: ${id} not found`);
        }
    }

    async update(taskToUpdate: UpdateTaskDTO): Promise<UpdatedTaskDTO> {
        try {
            return this.taskService.update(taskToUpdate);
        } catch (error) {
            throw new TaskNotFoundException(`Task with id: ${taskToUpdate.id} not found`);
        }
    }

    async delete(id: string): Promise<void> {
        try {
            return this.taskService.delete(id);
        } catch (error) {
            throw new TaskNotFoundException(id);
        }
    }

    private async toCreateTaskDto(newTask: CreateTaskDTO): Promise<CreateTaskDTO> {
        try {
            return {
                title: newTask.title?.toLowerCase(),
                description: newTask.description?.toLowerCase(),
                user_id: newTask.user_id
            };
        } catch (error) {
            throw new InvalidTaskDataException('Invalid input data type');
        }
    }

    private async toUpdateTaskDto(taskToUpdate: UpdateTaskDTO): Promise<UpdateTaskDTO> {
        return {
            id: taskToUpdate.id,
            title: taskToUpdate.title?.toLowerCase(),
            description: taskToUpdate.description?.toLowerCase(),
            user_id: taskToUpdate.user_id
        };
    }
}

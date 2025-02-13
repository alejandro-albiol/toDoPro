import { Request, Response } from 'express';
import { ITaskController } from "./i-task.controller.js";
import { ITaskService } from "../service/i-task.service.js";
import { CreateTaskDTO } from "../models/dtos/create-task.dto.js";
import { UpdateTaskDTO } from "../models/dtos/update-task.dto.js";
import { TaskException } from "../exceptions/base-task.exception.js";
import { TaskNotFoundException } from "../exceptions/task-not-found.exception.js";
import { ApiResponse } from "../../shared/responses/api-response.js";

export class TaskController implements ITaskController {
    constructor(private readonly taskService: ITaskService) {}

    async create(req: Request, res: Response): Promise<void> {
        try {
            const createDto: CreateTaskDTO = req.body;
            const task = await this.taskService.create(createDto);
            ApiResponse.created(res, task);
        } catch (error) {
            this.handleError(res, error);
        }
    }

    async findAll(req: Request, res: Response): Promise<void> {
        try {
            const tasks = await this.taskService.findAll();
            ApiResponse.success(res, tasks);
        } catch (error) {
            this.handleError(res, error);
        }
    }

    async findById(req: Request, res: Response): Promise<void> {
        try {
            const task = await this.taskService.findById(req.params.id);
            if (task) {
                ApiResponse.success(res, task);
            } else {
                ApiResponse.notFound(res, `Task with id ${req.params.id} not found`);
            }
        } catch (error) {
            this.handleError(res, error);
        }
    }

    async findAllByUserId(req: Request, res: Response): Promise<void> {
        try {
            const tasks = await this.taskService.findAllByUserId(req.params.userId);
            ApiResponse.success(res, tasks);
        } catch (error) {
            this.handleError(res, error);
        }
    }

    async findAllCompletedByUserId(req: Request, res: Response): Promise<void> {
        try {
            const tasks = await this.taskService.findAllCompletedByUserId(req.params.userId);
            ApiResponse.success(res, tasks);
        } catch (error) {
            this.handleError(res, error);
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try {
            const updateDto: UpdateTaskDTO = {
                id: req.params.id,
                ...req.body
            };
            const updatedTask = await this.taskService.update(updateDto);
            ApiResponse.success(res, updatedTask);
        } catch (error) {
            this.handleError(res, error);
        }
    }
    async toggleCompleted(req: Request, res: Response): Promise<void> {
        try {
            const task = await this.taskService.toggleCompleted(req.params.id);
            ApiResponse.success(res, task);
        } catch (error) {
            this.handleError(res, error);
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            await this.taskService.delete(req.params.id);
            ApiResponse.success(res, { message: 'Task deleted successfully' });
        } catch (error) {
            this.handleError(res, error);
        }
    }

    private handleError(res: Response, error: unknown): void {
        if (error instanceof TaskException) {
            ApiResponse.error(res, error, error instanceof TaskNotFoundException ? 404 : 400);
        } else {
            ApiResponse.error(res, error);
        }
    }
}

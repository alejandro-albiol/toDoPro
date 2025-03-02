import { Request, Response } from "express";
import { Task } from "../../tasks/models/entities/task.entity.js";
import { AiRecommendationService } from "../service/ai-recommendation.service.js";
import { IAiReccomendationController } from "./i-ai-recommendation.controller.js";
import { AiException } from "../exceptions/ai-base.exception.js";
import { ApiResponse } from "../../shared/responses/api-response.js";

export class AiReccomendationController implements IAiReccomendationController {
    private aiService: AiRecommendationService;

    constructor(aiService: AiRecommendationService) {
        this.aiService = aiService;
    }

    async sendRecommendation(req: Request, res: Response): Promise<void> {
        try {
            const tasks: Task[] = req.body;
            if (!tasks) {
                res.status(400).json({ error: "Tasks list is required" });
                return;
            }

            const recommendation = await this.aiService.recommend(tasks);
            ApiResponse.success(res, recommendation)
        } catch (error) {
            this.handleError(res, error)
        }
    }

    private handleError(res: Response, error: unknown): void {
        if (error instanceof AiException) {
            const statusCode = parseInt(error.errorCode, 10);
            ApiResponse.error(res, error, isNaN(statusCode) ? 500 : statusCode);
        } else {
            ApiResponse.error(res, error, 500);
        }
    }
}

import { Request, Response } from "express";
import { Task } from "../../tasks/models/entities/task.entity.js";
import { AiRecommendationService } from "../service/ai-recommendation.service.js";
import { IAiReccomendationController } from "./i-ai-recommendation.controller.js";

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
            res.json({ recommendation });
        } catch (error) {
            console.error("Error getting AI recommendation:", error);
            res.status(500).json({ error: "Failed to get AI recommendation" });
        }
    }
}

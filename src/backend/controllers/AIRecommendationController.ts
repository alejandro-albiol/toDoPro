import { AIRecommendationService } from "../services/AIRecommendationService.js";
import { TaskServices } from "../services/TaskServices.js";
import { SingleRecommendationResult } from "../models/responses/ProcessResult.js";

export class AIRecommendationController {
    static async getRecommendation(userId: string): Promise<SingleRecommendationResult> {
        try {
            if (!userId) {
                return {
                    isSuccess: false,
                    message: "User ID is required",
                    data: null
                };
            }

            const pendingTasks = await TaskServices.getPendingTasks(userId);
            const recommendation = await AIRecommendationService.getTaskRecommendation(pendingTasks);
            
            return {
                isSuccess: true,
                message: "Recommendation retrieved successfully",
                data: recommendation
            };
        } catch (error) {
            console.error('Error in getRecommendation:', error);
            return {
                isSuccess: false,
                message: error instanceof Error ? error.message : "Failed to get recommendation",
                data: null
            };
        }
    }
} 
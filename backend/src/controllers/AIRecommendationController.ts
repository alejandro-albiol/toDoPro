import { Task } from '../models/entities/Task.js';
import { AIRecommendationService } from '../services/AIRecommendationService.js';
import { TaskServices } from '../services/TaskServices.js';

export class AIRecommendationController {
  static async getRecommendation(userId: string): Promise<string> {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const pendingTasks = await TaskServices.getPendingTasks(userId);
      return await AIRecommendationService.getTaskRecommendation(pendingTasks);
    } catch (error) {
      throw error;
    }
  }
}

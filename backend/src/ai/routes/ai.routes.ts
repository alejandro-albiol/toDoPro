import { Router } from 'express';
import { TaskValidator } from '../../middlewares/validators/task-validator.js';
import { IAiReccomendationController } from '../controller/i-ai-recommendation.controller.js';

/**
 * Configures and returns a new Router instance with AI recommendation routes
 * Handles AI-based recommendations for task management
 * @param controller Implementation of IAiReccomendationController to handle route logic
 * @returns Configured Express Router instance
 */
export const configureAiRoutes = (
  controller: IAiReccomendationController,
): Router => {
  const router = Router();

  router.post('/recommend', (req, res) =>
    controller.sendRecommendation(req, res),
  );

  return router;
};

import Express, { Request, Response, NextFunction } from 'express';
import { AIRecommendationController } from "../controllers/AIRecommendationController.js";
import { IdValidator } from '../middlewares/IdValidator.js';

const aiRouter = Express.Router();

aiRouter.get(
    "/recommendation/:userId",
    IdValidator.validate('userId'),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await AIRecommendationController.getRecommendation(req.params.userId);
            if (result.isSuccess) {
                res.status(200).json(result);
            } else {
                res.status(400).json(result);
            }
        } catch (error) {
            next(error);
        }
    }
);

export default aiRouter;


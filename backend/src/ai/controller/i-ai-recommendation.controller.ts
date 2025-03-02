import { Request, Response } from 'express';

export interface IAiReccomendationController {
  sendRecommendation(req: Request, res: Response): void;
}

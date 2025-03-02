import { Task } from '../../tasks/models/entities/task.entity.js';

export interface IAiRecommendationService {
  recommend(tasks: Task[]): Promise<string>;
}

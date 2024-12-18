import { TaskStatsDTO } from '../dtos/TaskStatsDTO.js';

export interface TaskStatsResult {
  isSuccess: boolean;
  message: string;
  data: TaskStatsDTO | null;
}

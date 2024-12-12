import { TaskStatsDTO } from '../dtos/TaskStatsDTO';

export interface TaskStatsResult {
  isSuccess: boolean;
  message: string;
  data: TaskStatsDTO | null;
}

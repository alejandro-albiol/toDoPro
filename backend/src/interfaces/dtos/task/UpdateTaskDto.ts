export interface UpdateTaskDto {
  id: string;
  title?: string;
  description?: string;
  completed?: boolean;
  user_id?: string;
}

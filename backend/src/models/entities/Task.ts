export interface Task {
  id?: string;
  title: string;
  description: string;
  user_id?: string;
  creation_date: Date;
  completed: boolean;
  completed_at?: Date;
}

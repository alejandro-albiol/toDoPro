export interface CreateTaskDTO {
    title: string;
    description: string;
    user_id: string;
}

export interface UpdateTaskDTO {
    id: string;
    title?: string;
    description?: string;
    completed?: boolean;
} 
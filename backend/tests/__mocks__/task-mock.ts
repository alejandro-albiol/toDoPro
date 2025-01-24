import { Task } from "../../src/tasks/models/entities/task.entity";

export const mockTask: Task = {
    id: '1',
    user_id: '1',
    title: 'test task',
    description: 'this is a test task',
    completed: false,
    creation_date: new Date('2025-01-24T22:10:44.041Z')
};

export const mockTaskInput = {
    title: 'test task',
    description: 'this is a test task',
    user_id: '1'
};

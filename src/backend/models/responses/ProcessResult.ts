import { Task } from '../entities/Task';
import { User } from '../entities/User';

interface BaseProcessResult {
    isSuccess: boolean;
    message: string;
}

export interface SingleTaskResult extends BaseProcessResult {
    data: Task | null;
}

export interface TaskListResult extends BaseProcessResult {
    data: Task[] | null;
}

export interface SingleUserResult extends BaseProcessResult {
    data: User | null;
}

export interface UserListResult extends BaseProcessResult {
    data: User[] | null;
}

export interface NoDataResult extends BaseProcessResult {
    data?: null;
}

export interface SingleRecommendationResult extends BaseProcessResult {
    data: string | null;
}

export type ProcessResult = 
    | SingleTaskResult 
    | TaskListResult 
    | SingleUserResult 
    | UserListResult 
    | NoDataResult
    | SingleRecommendationResult;
import { pool } from '../configuration/configDataBase.js';
import { ITaskRepository } from './ITaskRepository.js';
import { Task } from '../models/entities/Task.js';
import { DatabaseException } from '../exceptions/dataBase/DataBaseException.js';
import { CreateTaskDto } from '../dtos/task/CreateTaskDto.js';

export class TaskRepository implements ITaskRepository {
  async findById(id: string): Promise<Task | undefined> {
    try {
      const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [
        id,
      ]);
      return result.rows[0];
    } catch (error) {
      throw new DatabaseException('find', 'Task');
    }
  }
  async create(taskDto: CreateTaskDto): Promise<Task> {
    try {
      const result = await pool.query(
        'INSERT INTO tasks (title, description, user_id) VALUES ($1, $2, $3) RETURNING *',
        [taskDto.title, taskDto.description, taskDto.user_id],
      );
      return result.rows[0];
    } catch (error) {
      throw new DatabaseException('create', 'Task');
    }
  }
  async update(id: string, entity: Partial<Task>): Promise<Task> {
    try {
      const result = await pool.query(
        'UPDATE tasks SET title = $1, description = $2, completed = $3 WHERE id = $4 RETURNING *',
        [entity.title, entity.description, entity.completed, id],
      );
      return result.rows[0];
    } catch (error) {
      throw new DatabaseException('update', 'Task');
    }
  }
  async delete(id: string): Promise<boolean> {
    try {
      await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
      return true;
    } catch (error) {
      throw new DatabaseException('delete', 'Task');
    }
  }
}

import { TaskService } from "../../src/tasks/service/TaskService.js";
import { TaskRepository } from "../../src/tasks/repository/TaskRepository.js";
import { TaskController } from "../../src/tasks/controller/TaskController.js";
import { ITaskService } from "../../src/tasks/service/ITaskService.js";

describe('TaskController', () => {
  let controller: TaskController;
  let mockTaskService: jest.Mocked<ITaskService>;

  beforeEach(() => {
    mockTaskService = {
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    } as any;

    controller = new TaskController(mockTaskService);
  });

  describe('create', () => {
    it('should create task successfully', async () => {
      const taskDto = {
        title: 'Test Task',
        description: 'This is a test task',
        user_id: '1'
      };
    });
  });
});
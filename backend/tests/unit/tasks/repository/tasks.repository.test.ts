import { TaskRepository } from "../../../../src/tasks/repository/task.repository";
import { NotFoundException } from "../../../../src/shared/exceptions/database/not-found.exception";

const mockPool = {
  query: jest.fn(),
};

describe("TasksRepository", () => {
  let tasksRepository: TaskRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    tasksRepository = new TaskRepository(mockPool);
  });

  test("should create a task successfully", async () => {
    const taskDto = { title: "testuser", description: "test@example.com", user_id: "hashedpassword" };
    const dbResponse = { rows: [{ id: "1", title: "testuser", description: "test@example.com",  }] };
    mockPool.query.mockResolvedValue(dbResponse);

    const result = await tasksRepository.create(taskDto);
    expect(result).toEqual(dbResponse.rows[0]);
    expect(mockPool.query).toHaveBeenCalledWith(expect.any(String), [taskDto.title, taskDto.description, taskDto.user_id]);
  });

  test("should find a task by ID", async () => {
    const taskId = "1";
    const dbResponse = { rows: [{ id: "1", username: "testuser", email: "test@example.com" }] };
    mockPool.query.mockResolvedValue(dbResponse);

    const result = await tasksRepository.findById(taskId);
    expect(result).toEqual(dbResponse.rows[0]);
    expect(mockPool.query).toHaveBeenCalledWith(expect.any(String), [taskId]);
  });

  test("find all completed tasks by user id", async () => {
    const userId = "1";
    const dbResponse = { rows: [
      { id: "1", title: "TaskTitle", description: "wojdbfoqjebf", completed: true, user_id: "1", creation_date: new Date(), completed_at: new Date() },
      { id: "2", title: "TaskTitle", description: "wojdbfoqjebf", completed: true, user_id: "1", creation_date: new Date(), completed_at: new Date() }
    ]};
    mockPool.query.mockResolvedValue(dbResponse);

    const result = await tasksRepository.findAllCompletedByUserId(userId);
    expect(result).toEqual(dbResponse.rows);
    expect(mockPool.query).toHaveBeenCalledWith(expect.any(String), [userId]);
  });

  test("should return null when task is not found by ID", async () => {
    mockPool.query.mockResolvedValue({ rows: [] });
    const result = await tasksRepository.findById("99");
    expect(result).toBeNull();
  });

  test("should toggle task completion status", async () => {
    const taskId = "1";
    const dbResponse = { id: "1", title: "TaskTitle", description: "wojdbfoqjebf", completed: true, user_id: "1", creation_date: new Date(), completed_at: new Date() };
    mockPool.query.mockResolvedValue(dbResponse);


    const result = await tasksRepository.toggleCompleted(taskId);
    expect(result).toEqual(void 0);
    expect(mockPool.query).toHaveBeenCalledWith(expect.any(String), [taskId]);
  });

  test("should delete a task", async () => {
    const taskId = "1";
    mockPool.query.mockResolvedValue({ rowCount: 1 });

    await expect(tasksRepository.delete(taskId)).resolves.toBeUndefined();
    expect(mockPool.query).toHaveBeenCalledWith(expect.any(String), [taskId]);
  });

  test("should throw NotFoundException when deleting a non-existent task", async () => {
    const taskId = "99";
    mockPool.query.mockResolvedValue({ rowCount: 0 });

    await expect(tasksRepository.delete(taskId)).rejects.toThrow(NotFoundException);
  });

  test("should find all tasks", async () => {
    const dbResponse = { rows: [{ id: "1", username: "testuser", email: "test@example.com" }] };
    mockPool.query.mockResolvedValue(dbResponse);

    const result = await tasksRepository.findAll();
    expect(result).toEqual(dbResponse.rows);
    expect(mockPool.query).toHaveBeenCalledWith(expect.any(String));
  });

  test("should find tasks by user id", async () => {
    const userId = "1";
    const dbResponse = { rows: [{ id: "1", title: "testuser", email: "test@example.com" }] };
    mockPool.query.mockResolvedValue(dbResponse);

    const result = await tasksRepository.findAllByUserId(userId);
    expect(result).toEqual(dbResponse.rows);
    expect(mockPool.query).toHaveBeenCalledWith(expect.any(String), [userId]);
  });

  test("should return empty array when no tasks are found by user id", async () => {
    mockPool.query.mockResolvedValue({ rows: [] });
    const result = await tasksRepository.findAllByUserId("nonexistent-user-id");
    expect(result).toEqual(null);
  });

  test("should update task title", async () => {
    const updateTaskDto = { id: "1", title: "Updated Task Title", user_id: "1" };
    const dbResponse = { rows: [{ id: "1", title: "Updated Task Title" }] };
    mockPool.query.mockResolvedValue(dbResponse);

    const result = await tasksRepository.update(updateTaskDto);
    expect(result).toEqual(dbResponse.rows[0]);
    expect(mockPool.query).toHaveBeenCalledWith(expect.any(String), [updateTaskDto.title, updateTaskDto.user_id]);
  });

  test("should throw NotFoundException when updating non-existent task", async () => {
    const updateTaskDto = { id: "99", title: "Nonexistent Task", user_id: "1" };
    mockPool.query.mockResolvedValue({ rows: [] });

    await expect(tasksRepository.update(updateTaskDto)).rejects.toThrow(NotFoundException);
  });
});
import { DatabaseError } from "pg";
import { UserRepository } from "../../../../src/users/repository/user.repository";
import { UniqueViolationException } from "../../../../src/shared/exceptions/database/unique-violation.exception";
import { NotFoundException } from "../../../../src/shared/exceptions/database/not-found.exception";

const mockPool = {
  query: jest.fn(),
};

describe("UserRepository", () => {
  let userRepository: UserRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    userRepository = new UserRepository(mockPool);
  });

  test("should create a user successfully", async () => {
    const userData = { username: "testuser", email: "test@example.com", password: "hashedpassword" };
    const dbResponse = { rows: [{ id: "1", username: "testuser", email: "test@example.com" }] };
    mockPool.query.mockResolvedValue(dbResponse);

    const result = await userRepository.create(userData);
    expect(result).toEqual(dbResponse.rows[0]);
    expect(mockPool.query).toHaveBeenCalledWith(expect.any(String), [userData.username, userData.email, userData.password]);
  });

  test("should throw UniqueViolationException when email is already taken", async () => {
    const userData = { username: "testuser", email: "taken@mail.com", password: "hashedpassword" };
    const dbError = new DatabaseError("duplicate key value violates unique constraint", 0, "error");
    dbError.code = "23505";
    dbError.detail = "Key (email)=(taken@mail.com) already exists.";
    mockPool.query.mockRejectedValue(dbError);
  });

  test("should throw UniqueViolationException when username is already taken", async () => {
    const userData = { username: "testuser", email: "test@example.com", password: "hashedpassword" };
    const dbError = new DatabaseError("duplicate key value violates unique constraint", 0, "error");
    dbError.code = "23505";
    dbError.detail = "Key (username)=(testuser) already exists.";
    mockPool.query.mockRejectedValue(dbError);

    await expect(userRepository.create(userData)).rejects.toThrow(UniqueViolationException);
  });

  test("should find a user by ID", async () => {
    const userId = "1";
    const dbResponse = { rows: [{ id: "1", username: "testuser", email: "test@example.com" }] };
    mockPool.query.mockResolvedValue(dbResponse);

    const result = await userRepository.findById(userId);
    expect(result).toEqual(dbResponse.rows[0]);
    expect(mockPool.query).toHaveBeenCalledWith(expect.any(String), [userId]);
  });

  test("should return null when user is not found by ID", async () => {
    mockPool.query.mockResolvedValue({ rows: [] });
    const result = await userRepository.findById("99");
    expect(result).toBeNull();
  });

  test("should delete a user", async () => {
    const userId = "1";
    mockPool.query.mockResolvedValue({ rowCount: 1 });

    await expect(userRepository.delete(userId)).resolves.toBeUndefined();
    expect(mockPool.query).toHaveBeenCalledWith(expect.any(String), [userId]);
  });

  test("should throw NotFoundException when deleting a non-existent user", async () => {
    const userId = "99";
    mockPool.query.mockResolvedValue({ rowCount: 0 });

    await expect(userRepository.delete(userId)).rejects.toThrow(NotFoundException);
  });

  test("should find all users", async () => {
    const dbResponse = { rows: [{ id: "1", username: "testuser", email: "test@example.com" }] };
    mockPool.query.mockResolvedValue(dbResponse);

    const result = await userRepository.findAll();
    expect(result).toEqual(dbResponse.rows);
    expect(mockPool.query).toHaveBeenCalledWith(expect.any(String));
  });

  test("should find a user by username", async () => {
    const username = "testuser";
    const dbResponse = { rows: [{ id: "1", username: "testuser", email: "test@example.com" }] };
    mockPool.query.mockResolvedValue(dbResponse);

    const result = await userRepository.findByUsername(username);
    expect(result).toEqual(dbResponse.rows[0]);
    expect(mockPool.query).toHaveBeenCalledWith(expect.any(String), [username]);
  });

  test("should return null when user is not found by username", async () => {
    mockPool.query.mockResolvedValue({ rows: [] });
    const result = await userRepository.findByUsername("nonexistent");
    expect(result).toBeNull();
  });

  test("should get password by username", async () => {
    const username = "testuser";
    const dbResponse = { rows: [{ password: "hashedpassword" }] };
    mockPool.query.mockResolvedValue(dbResponse);

    const result = await userRepository.getPasswordByUsername(username);
    expect(result).toEqual(dbResponse.rows[0].password);
    expect(mockPool.query).toHaveBeenCalledWith(expect.any(String), [username]);
  });

  test("should return null when password is not found by username", async () => {
    mockPool.query.mockResolvedValue({ rows: [] });
    const result = await userRepository.getPasswordByUsername("nonexistent");
    expect(result).toBeNull();
  });

  test("should find a user by email", async () => {
    const email = "test@example.com";
    const dbResponse = { rows: [{ id: "1", username: "testuser", email: "test@example.com" }] };
    mockPool.query.mockResolvedValue(dbResponse);

    const result = await userRepository.findByEmail(email);
    expect(result).toEqual(dbResponse.rows[0]);
    expect(mockPool.query).toHaveBeenCalledWith(expect.any(String), [email]);
  });

  test("should return null when user is not found by email", async () => {
    mockPool.query.mockResolvedValue({ rows: [] });
    const result = await userRepository.findByEmail("nonexistent@example.com");
    expect(result).toBeNull();
  });

  test("should update user password", async () => {
    const userId = "1";
    const newPassword = "newhashedpassword";
    mockPool.query.mockResolvedValue({ rowCount: 1 });

    await expect(userRepository.updatePassword(userId, newPassword)).resolves.toBeUndefined();
    expect(mockPool.query).toHaveBeenCalledWith(expect.any(String), [userId, newPassword]);
  });

  test("should throw NotFoundException when updating password for non-existent user", async () => {
    const userId = "99";
    const newPassword = "newhashedpassword";
    mockPool.query.mockResolvedValue({ rowCount: 0 });

    await expect(userRepository.updatePassword(userId, newPassword)).rejects.toThrow(NotFoundException);
  });

  test("should update user details", async () => {
    const userData = { id: "1", username: "updateduser", email: "updated@example.com" };
    const dbResponse = { rows: [{ id: "1", username: "updateduser", email: "updated@example.com" }] };
    mockPool.query.mockResolvedValue(dbResponse);

    const result = await userRepository.update(userData);
    expect(result).toEqual(dbResponse.rows[0]);
    expect(mockPool.query).toHaveBeenCalledWith(expect.any(String), [userData.id, userData.username, userData.email]);
  });

  test("should throw NotFoundException when updating non-existent user", async () => {
    const userData = { id: "99", username: "nonexistent", email: "nonexistent@example.com" };
    mockPool.query.mockResolvedValue({ rows: [] });

    await expect(userRepository.update(userData)).rejects.toThrow(NotFoundException);
  });
});
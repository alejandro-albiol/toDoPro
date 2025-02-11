import { UsernameAlreadyExistsException } from '../exceptions/username-already-exists.exception.js';
import { UserNotFoundException } from '../exceptions/user-not-found.exception.js';
import { UserCreationFailedException } from '../exceptions/user-creation-failed.exception.js';
import { InvalidUserDataException } from '../exceptions/invalid-user-data.exception.js';
import { EmailAlreadyExistsException } from '../exceptions/email-already-exists.exception.js';

describe('User Exceptions', () => {
  it('should create UsernameAlreadyExistsException', () => {
    const exception = new UsernameAlreadyExistsException('testuser');
    expect(exception.message).toBe("User with username 'testuser' already exists");
    expect(exception.statusCode).toBe(409);
    expect(exception.errorCode).toBe('U7');
  });

  it('should create UserNotFoundException', () => {
    const exception = new UserNotFoundException('123');
    expect(exception.message).toBe('User with id 123 not found');
    expect(exception.statusCode).toBe(404);
    expect(exception.errorCode).toBe('U5');
  });

  it('should create UserCreationFailedException', () => {
    const exception = new UserCreationFailedException('Failed to create user');
    expect(exception.message).toBe('Failed to create user');
    expect(exception.statusCode).toBe(400);
    expect(exception.errorCode).toBe('U9');
  });

  it('should create InvalidUserDataException', () => {
    const exception = new InvalidUserDataException('Invalid user data');
    expect(exception.message).toBe('Invalid user data');
    expect(exception.statusCode).toBe(400);
    expect(exception.errorCode).toBe('U8');
  });

  it('should create EmailAlreadyExistsException', () => {
    const exception = new EmailAlreadyExistsException('test@example.com');
    expect(exception.message).toBe("User with email 'test@example.com' already exists");
    expect(exception.statusCode).toBe(409);
    expect(exception.errorCode).toBe('U6');
  });
});

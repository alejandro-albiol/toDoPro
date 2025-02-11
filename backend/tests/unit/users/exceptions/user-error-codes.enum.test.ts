import { UserErrorCodes } from '../../../../src/users/exceptions/enums/user-error-codes.enum.js';

describe('UserErrorCodes Enum', () => {
  it('should have correct values', () => {
    expect(UserErrorCodes.INVALID_USERNAME).toBe('U1');
    expect(UserErrorCodes.INVALID_EMAIL).toBe('U2');
    expect(UserErrorCodes.INVALID_PASSWORD).toBe('U3');
    expect(UserErrorCodes.INVALID_TOKEN).toBe('U4');
    expect(UserErrorCodes.USER_NOT_FOUND).toBe('U5');
    expect(UserErrorCodes.EMAIL_ALREADY_EXISTS).toBe('U6');
    expect(UserErrorCodes.USERNAME_ALREADY_EXISTS).toBe('U7');
    expect(UserErrorCodes.INVALID_USER_DATA).toBe('U8');
    expect(UserErrorCodes.USER_CREATION_FAILED).toBe('U9');
  });
});

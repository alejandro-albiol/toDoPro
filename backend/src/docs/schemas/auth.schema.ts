export const authSchema = {
  AuthResponse: {
    type: 'object',
    properties: {
      token: { type: 'string' },
      user: { $ref: '#/components/schemas/User' },
    },
  },
  LoginDTO: {
    type: 'object',
    properties: {
      username: { type: 'string' },
      password: { type: 'string' },
    },
    required: ['username', 'password'],
  },
  ChangePasswordDTO: {
    type: 'object',
    properties: {
      oldPassword: { type: 'string' },
      newPassword: { type: 'string' },
    },
    required: ['oldPassword', 'newPassword'],
  },
  RegisterDTO: {
    type: 'object',
    properties: {
      username: { type: 'string' },
      email: { type: 'string' },
      password: { type: 'string' },
    },
    required: ['username', 'email', 'password'],
  },
};

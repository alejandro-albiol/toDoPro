export const authSchema = {
  AuthResponse: {
    type: 'object',
    properties: {
      token: { type: 'string' },
      user: { $ref: '#/components/schemas/User' }
    }
  },
  LoginDTO: {
    type: 'object',
    properties: {
      email: { type: 'string' },
      password: { type: 'string' }
    },
    required: ['email', 'password']
  },
  ChangePasswordDTO: {
    type: 'object',
    properties: {
      oldPassword: { type: 'string' },
      newPassword: { type: 'string' }
    },
    required: ['oldPassword', 'newPassword']
  }
};

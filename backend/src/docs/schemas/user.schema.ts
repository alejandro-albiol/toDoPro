export const userSchema = {
  User: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      username: { type: 'string' },
      email: { type: 'string' }
    }
  },
  CreateUserDTO: {
    type: 'object',
    properties: {
      username: { type: 'string' },
      email: { type: 'string' },
      password: { type: 'string' }
    },
    required: ['username', 'email', 'password']
  },
  UpdateUserDTO: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      username: { type: 'string' },
      email: { type: 'string' }
    },
    required: ['id']
  }
};

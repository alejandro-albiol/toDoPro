export const taskSchema = {
  Task: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      title: { type: 'string' },
      description: { type: 'string' },
      user_id: { type: 'string' },
      completed: { type: 'boolean' },
      creation_date: { type: 'string', format: 'date-time' },
    },
  },
  CreateTaskDTO: {
    type: 'object',
    properties: {
      title: { type: 'string' },
      description: { type: 'string' },
      user_id: { type: 'string' },
    },
    required: ['title', 'description', 'user_id'],
  },
  UpdateTaskDTO: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      title: { type: 'string' },
      description: { type: 'string' },
    },
    required: ['id'],
  },
};

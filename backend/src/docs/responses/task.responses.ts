export const taskResponses = {
  TaskCreated: {
    description: 'Task created successfully',
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/ApiResponse' },
        example: {
          status: 'success',
          message: 'Task created successfully',
          data: {
            id: '123',
            title: 'Example task',
            description: 'Task description',
            user_id: '456',
            completed: false,
            creation_date: '2024-01-24T22:10:44.041Z'
          }
        }
      }
    }
  },
  TaskNotFound: {
    description: 'Task not found',
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/ApiResponse' },
        example: {
          status: 'error',
          message: 'Task not found',
          errors: [
            {
              code: 'T1',
              message: 'Task with specified ID not found'
            }
          ]
        }
      }
    }
  }
}; 
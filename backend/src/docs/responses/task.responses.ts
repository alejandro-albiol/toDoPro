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
          data: null,
          errors: [
            {
              code: 'T1',
              message: 'Task with specified ID not found'
            }
          ]
        }
      }
    }
  },
  InvalidTaskData: {
    description: 'Invalid task data',
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/ApiResponse' },
        examples: {
          invalidData: {
            value: {
              status: 'error',
              message: 'Invalid task data',
              data: null,
              errors: [
                {
                  code: 'T2',
                  message: 'Invalid task data format'
                }
              ]
            },
            summary: 'Invalid task data format'
          },
          invalidTitle: {
            value: {
              status: 'error',
              message: 'Invalid task title',
              data: null,
              errors: [
                {
                  code: 'T3',
                  message: 'Title must not be empty'
                }
              ]
            },
            summary: 'Invalid title'
          },
          invalidDescription: {
            value: {
              status: 'error',
              message: 'Invalid task description',
              data: null,
              errors: [
                {
                  code: 'T4',
                  message: 'Description is too long'
                }
              ]
            },
            summary: 'Invalid description'
          }
        }
      }
    }
  },
  TaskCreationFailed: {
    description: 'Task creation failed',
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/ApiResponse' },
        example: {
          status: 'error',
          message: 'Task creation failed',
          data: null,
          errors: [
            { code: 'T6', message: 'Task creation failed' }
          ]
        }
      }
    }
  },
  TaskResponse: {
    description: 'Response for a singular task',
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/ApiResponse' },
        example: {
          status: 'success',
          message: 'Task retrieved successfully',
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
};
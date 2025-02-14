export const TaskPaths = {
  '/tasks': {
    post: {
      tags: ['Tasks'],
      summary: 'Create a new task',
      security: [{ BearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/CreateTaskDTO'
            }
          }
        }
      },
      responses: {
        201: { $ref: '#/components/responses/TaskCreated' },
        400: { $ref: '#/components/responses/InvalidTaskData' },
        401: { $ref: '#/components/responses/Unauthorized' },
        500: { $ref: '#/components/responses/InternalServerError' }
      }
    },
    get: {
      tags: ['Tasks'],
      summary: 'Get all tasks',
      security: [{ BearerAuth: [] }],
      responses: {
        200: { $ref: '#/components/responses/TaskResponse' },
        401: { $ref: '#/components/responses/Unauthorized' },
        500: { $ref: '#/components/responses/InternalServerError' }
      }
    }
  },
  '/tasks/user/{userId}': {
    get: {
      tags: ['Tasks'],
      summary: 'Get tasks by user ID',
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          in: 'path',
          name: 'userId',
          required: true,
          schema: {
            type: 'string'
          }
        }
      ],
      responses: {
        200: { $ref: '#/components/responses/TaskResponse' },
        401: { $ref: '#/components/responses/Unauthorized' },
        404: { $ref: '#/components/responses/TaskNotFound' },
        500: { $ref: '#/components/responses/InternalServerError' }
      }
    }
  },
  '/tasks/user/{userId}/completed': {
    get: {
      tags: ['Tasks'],
      summary: 'Get completed tasks by user ID',
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          in: 'path',
          name: 'userId',
          required: true,
          schema: {
            type: 'string'
          }
        }
      ],
      responses: {
        200: { $ref: '#/components/responses/TaskResponse' },
        401: { $ref: '#/components/responses/Unauthorized' },
        404: { $ref: '#/components/responses/TaskNotFound' },
        500: { $ref: '#/components/responses/InternalServerError' }
      }
    }
  },
  '/tasks/{id}': {
    get: {
      tags: ['Tasks'],
      summary: 'Get task by ID',
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: {
            type: 'string'
          }
        }
      ],
      responses: {
        200: { $ref: '#/components/responses/TaskResponse' },
        401: { $ref: '#/components/responses/Unauthorized' },
        404: { $ref: '#/components/responses/TaskNotFound' },
        500: { $ref: '#/components/responses/InternalServerError' }
      }
    },
    put: {
      tags: ['Tasks'],
      summary: 'Update a task',
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: {
            type: 'string'
          }
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/UpdateTaskDTO'
            }
          }
        }
      },
      responses: {
        200: { $ref: '#/components/responses/TaskResponse' },
        401: { $ref: '#/components/responses/Unauthorized' },
        404: { $ref: '#/components/responses/TaskNotFound' },
        500: { $ref: '#/components/responses/InternalServerError' }
      }
    },
    delete: {
      tags: ['Tasks'],
      summary: 'Delete a task',
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: {
            type: 'string'
          }
        }
      ],
      responses: {
        204: {
          description: 'Task deleted successfully'
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        404: { $ref: '#/components/responses/TaskNotFound' },
        500: { $ref: '#/components/responses/InternalServerError' }
      }
    }
  },
  '/tasks/{id}/toggle-completed': {
    put: {
      tags: ['Tasks'],
      summary: 'Toggle task completion status',
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: {
            type: 'string'
          }
        }
      ],
      responses: {
        200: { $ref: '#/components/responses/TaskResponse' },
        401: { $ref: '#/components/responses/Unauthorized' },
        404: { $ref: '#/components/responses/TaskNotFound' },
        500: { $ref: '#/components/responses/InternalServerError' }
      }
    }
  }
};
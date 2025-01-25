export const UserPaths = {
  '/users': {
    post: {
      tags: ['Users'],
      summary: 'Create a new user',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/CreateUserDTO'
            }
          }
        }
      },
      responses: {
        201: { $ref: '#/components/responses/UserCreated' },
        400: { $ref: '#/components/responses/BadRequest' }
      }
    }
  },
  '/users/{id}': {
    get: {
      tags: ['Users'],
      summary: 'Get user by ID',
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: { type: 'string' }
        }
      ],
      responses: {
        200: { $ref: '#/components/responses/UserResponse' },
        404: { $ref: '#/components/responses/UserNotFound' }
      }
    },
    delete: {
      tags: ['Users'],
      summary: 'Delete a user',
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: { type: 'string' }
        }
      ],
      responses: {
        204: {
          description: 'User deleted successfully'
        },
        404: { $ref: '#/components/responses/UserNotFound' }
      }
    }
  }
}; 
export const UserPaths = {
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
        404: { $ref: '#/components/responses/UserNotFound' },
        500: { $ref: '#/components/responses/InternalServerError' }
      }
    },
    put: {
      tags: ['Users'],
      summary: 'Update a user',
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: { type: 'string' }
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/UpdateUserDTO'
            }
          }
        }
      },
      responses: {
        200: { $ref: '#/components/responses/UserResponse' },
        404: { $ref: '#/components/responses/UserNotFound' },
        500: { $ref: '#/components/responses/InternalServerError' }
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
        404: { $ref: '#/components/responses/UserNotFound' },
        500: { $ref: '#/components/responses/InternalServerError' }
      }
    }
  }
};
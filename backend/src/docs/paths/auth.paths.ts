export const AuthPaths = {
  '/auth/login': {
    post: {
      tags: ['Auth'],
      summary: 'User login',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/LoginDTO'
            }
          }
        }
      },
      responses: {
        200: { $ref: '#/components/responses/LoginSuccess' },
        400: { $ref: '#/components/responses/InvalidCredentials' },
        500: { $ref: '#/components/responses/InternalServerError' }
      }
    }
  },
  '/auth/register': {
    post: {
      tags: ['Auth'],
      summary: 'User registration',
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
        400: { $ref: '#/components/responses/InvalidUserData' },
        409: { $ref: '#/components/responses/UserConflict' },
        500: { $ref: '#/components/responses/InternalServerError' }
      }
    }
  },
  '/auth/protected-route': {
    get: {
      tags: ['Auth'],
      summary: 'Protected route example',
      security: [{ BearerAuth: [] }],
      responses: {
        200: {
          description: 'Protected route accessed successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiResponse' },
              example: {
                status: 'success',
                message: 'Protected route accessed successfully',
                data: {
                  example: 'This is a protected route'
                }
              }
            }
          }
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        500: { $ref: '#/components/responses/InternalServerError' }
      }
    }
  }
};

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
              $ref: '#/components/schemas/LoginDTO',
            },
          },
        },
      },
      responses: {
        200: { $ref: '#/components/responses/LoginSuccess' },
        400: { $ref: '#/components/responses/InvalidCredentials' },
        500: { $ref: '#/components/responses/InternalServerError' },
      },
    },
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
              $ref: '#/components/schemas/CreateUserDTO',
            },
          },
        },
      },
      responses: {
        201: { $ref: '#/components/responses/UserCreated' },
        400: { $ref: '#/components/responses/InvalidUserData' },
        409: { $ref: '#/components/responses/UserConflict' },
        500: { $ref: '#/components/responses/InternalServerError' },
      },
    },
  },
  '/auth/password/change': {
    post: {
      tags: ['Auth'],
      summary: 'Update user password',
      security: [{ BearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ChangePasswordDTO' },
          },
        },
      },
      responses: {
        200: {
          description: 'Password updated successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiResponse' },
              example: {
                status: 'success',
                message: 'Password updated successfully',
                data: {
                  example: 'Password updated successfully',
                },
              },
            },
          },
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        500: { $ref: '#/components/responses/InternalServerError' },
      },
    },
  },
};

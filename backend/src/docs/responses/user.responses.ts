export const userResponses = {
  UserCreated: {
    description: 'User created successfully',
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/ApiResponse' },
        example: {
          status: 'success',
          message: 'User created successfully',
          data: {
            id: '123',
            username: 'john_doe',
            email: 'john@example.com'
          }
        }
      }
    }
  },
  UserNotFound: {
    description: 'User not found',
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/ApiResponse' },
        example: {
          status: 'error',
          message: 'User not found',
          data: null,
          errors: [
            {
              code: 'U1',
              message: 'User with id 123 not found'
            }
          ]
        }
      }
    }
  },
  UserConflict: {
    description: 'Username or email already exists',
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/ApiResponse' },
        examples: {
          emailConflict: {
            value: {
              status: 'error',
              message: 'Email already exists',
              data: null,
              errors: [
                {
                  code: 'U2',
                  message: "User with email 'john@example.com' already exists"
                }
              ]
            },
            summary: 'Email already exists'
          },
          usernameConflict: {
            value: {
              status: 'error',
              message: 'Username already exists',
              data: null,
              errors: [
                {
                  code: 'U3',
                  message: "User with username 'john_doe' already exists"
                }
              ]
            },
            summary: 'Username already exists'
          }
        }
      }
    }
  }
}; 
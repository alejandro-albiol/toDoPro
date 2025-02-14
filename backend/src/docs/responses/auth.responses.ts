export const authResponses = {
  LoginSuccess: {
    description: 'User logged in successfully',
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/AuthResponse' },
        example: {
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          user: {
            id: '123',
            username: 'john_doe',
            email: 'john@example.com'
          }
        }
      }
    }
  },
  InvalidCredentials: {
    description: 'Invalid email or password',
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/ApiResponse' },
        example: {
          status: 'error',
          message: 'Invalid email or password',
          data: null,
          errors: [
            {
              code: 'AUTH1',
              message: 'Invalid email or password'
            }
          ]
        }
      }
    }
  },
  TokenExpired: {
    description: 'User token has expired',
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/ApiResponse' },
        example: {
          status: 'error',
          message: 'Token has expired',
          data: null,
          errors: [
            {
              code: 'AUTH2',
              message: 'Token has expired'
            }
          ]
        }
      }
    }
  },
  InvalidToken: {
    description: 'Invalid token',
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/ApiResponse' },
        example: {
          status: 'error',
          message: 'Invalid token',
          data: null,
          errors: [
            {
              code: 'AUTH3',
              message: 'Invalid token'
            }
          ]
        }
      }
    }
  },
  Unauthorized: {
    description: 'User is not authorized',
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/ApiResponse' },
        example: {
          status: 'error',
          message: 'User is not authorized',
          data: null,
          errors: [
            {
              code: 'AUTH4',
              message: 'User is not authorized'
            }
          ]
        }
      }
    }
  },
  InvalidJwtSecret: {
    description: 'Invalid JWT secret',
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/ApiResponse' },
        example: {
          status: 'error',
          message: 'Invalid JWT secret',
          data: null,
          errors: [
            {
              code: 'AUTH5',
              message: 'Invalid JWT secret'
            }
          ]
        }
      }
    }
  },
  UnknownError: {
    description: 'Unknown error',
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/ApiResponse' },
        example: {
          status: 'error',
          message: 'An unknown error occurred',
          data: null,
          errors: [
            {
              code: 'AUTH6',
              message: 'An unknown error occurred'
            }
          ]
        }
      }
    }
  }
};

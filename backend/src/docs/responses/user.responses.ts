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
            username: 'John Doe',
            email: 'john@example.com',
            creation_date: '2024-01-24T22:10:44.041Z'
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
          errors: [
            {
              code: 'U1',
              message: 'User with specified ID not found'
            }
          ]
        }
      }
    }
  }
}; 
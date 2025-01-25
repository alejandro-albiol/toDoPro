export const commonResponses = {
  BadRequest: {
    description: 'Bad request',
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/ApiResponse' },
        example: {
          status: 'error',
          message: 'Invalid request data',
          errors: [
            {
              code: 'VALIDATION_ERROR',
              message: 'Invalid input data'
            }
          ]
        }
      }
    }
  },
  NotFound: {
    description: 'Resource not found',
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/ApiResponse' },
        example: {
          status: 'error',
          message: 'Resource not found',
          errors: [
            {
              code: 'NOT_FOUND',
              message: 'Resource with specified ID not found'
            }
          ]
        }
      }
    }
  },
  InternalServerError: {
    description: 'Internal server error',
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/ApiResponse' },
        example: {
          status: 'error',
          message: 'Internal server error',
          errors: [
            {
              code: 'INTERNAL_ERROR',
              message: 'An unexpected error occurred'
            }
          ]
        }
      }
    }
  }
}; 
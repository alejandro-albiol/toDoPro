export const commonResponses = {
  InvalidJsonFormat: {
    description: 'Invalid JSON format',
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/ApiResponse' },
        example: {
          status: 'error',
          message: 'Invalid JSON format',
          errors: [
            {
              code: 'F1',
              message: 'Invalid JSON format'
            }
          ]
        }
      }
    }
  },
  InvalidIdFormat: {
    description: 'Invalid ID format',
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/ApiResponse' },
        example: {
          status: 'error',
          message: 'Invalid ID format',
          errors: [
            {
              code: 'F2',
              message: 'Invalid ID format'
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
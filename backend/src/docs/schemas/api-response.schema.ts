export const apiResponseSchema = {
  ApiResponse: {
    type: 'object',
    properties: {
      status: {
        type: 'string',
        enum: ['success', 'error']
      },
      message: { type: 'string' },
      data: { 
        oneOf: [
          { $ref: '#/components/schemas/Task' },
          { $ref: '#/components/schemas/User' },
          { type: 'array', items: { $ref: '#/components/schemas/Task' } },
          { type: 'array', items: { $ref: '#/components/schemas/User' } },
          { type: 'null' }
        ]
      },
      errors: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            code: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    }
  }
};
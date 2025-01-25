import { apiResponseSchema } from './schemas/api-response.schema.js';
import { taskSchema } from './schemas/task.schema.js';
import { userSchema } from './schemas/user.schema.js';
import { commonResponses } from './responses/common.responses.js';
import { taskResponses } from './responses/task.responses.js';
import { userResponses } from './responses/user.responses.js';
import { TaskPaths } from './paths/task.paths.js';
import { UserPaths } from './paths/user.paths.js';

export const swaggerConfig = {
  openapi: '3.0.0',
  info: {
    title: 'toDoPro API',
    version: '1.0.0',
    description: 'API documentation for toDoPro application'
  },
  servers: [
    {
      url: '/api/v1',
      description: 'API version 1'
    }
  ],
  components: {
    schemas: {
      ...apiResponseSchema,
      ...taskSchema,
      ...userSchema
    },
    responses: {
      ...commonResponses,
      ...taskResponses,
      ...userResponses
    }
  },
  paths: {
    ...TaskPaths,
    ...UserPaths
  }
}; 
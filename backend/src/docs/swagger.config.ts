import { apiResponseSchema } from './schemas/api-response.schema.js';
import { taskSchema } from './schemas/task.schema.js';
import { userSchema } from './schemas/user.schema.js';
import { authSchema } from './schemas/auth.schema.js';
import { commonResponses } from './responses/common.responses.js';
import { taskResponses } from './responses/task.responses.js';
import { userResponses } from './responses/user.responses.js';
import { authResponses } from './responses/auth.responses.js';
import { TaskPaths } from './paths/task.paths.js';
import { UserPaths } from './paths/user.paths.js';
import { AuthPaths } from './paths/auth.paths.js';

export const swaggerConfig = {
  openapi: '3.0.0',
  info: {
    title: 'ToDoPro API',
    version: '1.0.0',
    description: 'API documentation for ToDoPro application'
  },
  servers: [
    {
      url: '/api/v1',
      description: 'API version 1'
    }
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      ...apiResponseSchema,
      ...taskSchema,
      ...userSchema,
      ...authSchema
    },
    responses: {
      ...commonResponses,
      ...taskResponses,
      ...userResponses,
      ...authResponses
    }
  },
  security: [
    {
      BearerAuth: []
    }
  ],
  paths: {
    ...TaskPaths,
    ...UserPaths,
    ...AuthPaths
  }
};
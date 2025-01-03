import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'ToDoPro API',
        version: '1.0.0',
        description: 'API para gestión de tareas'
    },
    servers: [
        {
            url: 'http://localhost:3000',
            description: 'Servidor de desarrollo'
        }
    ]
};

const options = {
    swaggerDefinition,
    apis: ['./src/routes/*.ts']
};

export const swaggerSpec = swaggerJSDoc(options); 
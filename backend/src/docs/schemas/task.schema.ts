export const taskSchema = {
    Task: {
        type: 'object',
        properties: {
            id: { 
                type: 'string',
                example: '55',
                description: 'Unique identifier'
             },
            title: { 
                type: 'string',
                example: 'Task 1',
                description: 'Task title'
             },
            description: { 
                type: 'string',
                example: 'Description 1',
                description: 'Task description'},
            user_id: { 
                type: 'string', 
                example: '1',
                description: 'User ID'
             },
            creation_date: { 
                type: 'string',
                example: '2025-09-01T00:00:00.000Z',
                description: 'Task creation date'},
            completed: { 
                type: 'boolean',
                example: false,
                description: 'Task completion status'
             },
            completed_at: { 
                type: 'string',
                example: '2025-09-01T00:00:00.000Z',
                description: 'Timestamp when the task was completed'
             }
        }
    },
    CreateTaskDTO: {
        type: 'object',
        properties: {
            title: { 
                type: 'string',
                example: 'Task 1',
                description: 'Task title' 
            },
            description: { 
                type: 'string', 
                example: 'Description 1',
                description: 'Task description'
            },
            user_id: { 
                type: 'string',
                example: '1',
                description: 'User ID' 
            }
        },
        required: ['title', 'description', 'user_id']
    },
    UpdateTaskDTO: {
        type: 'object',
        properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            user_id: { type: 'string' }
        },
        required: ['id', 'user_id']
    },
};
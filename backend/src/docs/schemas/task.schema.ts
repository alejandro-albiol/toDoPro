export const taskSchema = {
    Task: {
        type: 'object',
        properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            user_id: { type: 'string' },
            creation_date: { type: 'string' },
            completed: { type: 'boolean' },
            completed_at: { type: 'string' }
        },
        required: ['id', 'title', 'description', 'completed', 'user_id', 'creation_date']
    },
    CreateTaskDTO: {
        type: 'object',
        properties: {
            title: { type: 'string' },
            description: { type: 'string' },
            user_id: { type: 'string' }
        },
        required: ['title', 'description', 'user_id']
    },
    UpdateTaskDTO: {
        type: 'object',
        properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            completed: { type: 'boolean' },
            user_id: { type: 'string' }
        },
        required: ['id', 'user_id']
    },
    UpdatedTaskDTO: {
        type: 'object',
        properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            completed: { type: 'boolean' }
        },
        required: ['id', 'title', 'description', 'completed']
    }
};
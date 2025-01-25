export const userSchema = {
    User: {
        type: 'object',
        properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            password: { type: 'string' },
            creation_date: { 
                type: 'string',
                format: 'date-time'
            }
        },
        required: ['id', 'name', 'email', 'password']
    },
    CreateUserDTO: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
            name: { type: 'string' },
            email: { type: 'string' },
            password: { type: 'string' }
        }
    },
    UpdateUserDTO: {
        type: 'object',
        properties: {
            id: { type: 'string' },
            username: { type: 'string' },
            email: { type: 'string' }
        },
        required: ['id']
    },
    UpdatedUserDTO: {
        type: 'object',
        properties: {
            id: { type: 'string' },
            username: { type: 'string' },
            email: { type: 'string' }
        },
        required: ['id', 'username', 'email']
    }
}

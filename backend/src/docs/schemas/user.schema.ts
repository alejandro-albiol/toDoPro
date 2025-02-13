export const userSchema = {
    User: {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                example: '55',
                description: 'Unique identifier'
            },
            username: { 
                type: 'string',
                example: 'john_doe',
                description: 'User username' 
            },
            email: { 
                type: 'string',
                example: 'john@example.com',
                description: 'User email address'
            },
            password: { 
                type: 'string',
                example: 'Password123!',
                description: "User password" 
            }
        }
    },
    CreateUserDTO: {
        type: 'object',
        required: ['username', 'email', 'password'],
        properties: {
            username: {
                type: 'string',
                example: 'john_doe',
                minLength: 3,
                description: 'Username must be at least 3 characters long'
            },
            email: {
                type: 'string',
                example: 'john@example.com',
                format: 'email',
                description: 'Must be a valid email address'
            },
            password: {
                type: 'string',
                example: 'Password123!',
                minLength: 8,
                description: 'Password must be at least 8 characters long and include uppercase, lowercase, numbers and special characters'
            }
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
    }
}

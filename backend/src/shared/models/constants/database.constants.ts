export const DatabaseConstraints = {
    // Primary Keys
    USERS_PRIMARY_KEY: 'users_pkey',
    TASKS_PRIMARY_KEY: 'tasks_pkey',
    
    // Unique Constraints
    USERS_USERNAME_UNIQUE: 'users_username_key',
    USERS_EMAIL_UNIQUE: 'users_email_key',
    
    // Foreign Keys
    TASKS_USER_FK: 'tasks_user_id_fkey'
} as const; 
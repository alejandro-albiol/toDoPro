export const userMock = {
    validUser: {
        id: '1',
        username: 'testUser',
        email: 'test@test.com',
        password: 'hashedPassword123',
    },
    

    createUserData: {
        username: 'newUser',
        email: 'new@test.com',
        password: 'Password123!'
    },


    updateUserData: {
        id: '1',
        username: 'updatedUser',
        email: 'updated@test.com'
    },


    userList: [
        {
            id: '1',
            username: 'user1',
            email: 'user1@test.com',
            password: 'hashedPassword123',
        },
        {
            id: '2',
            username: 'user2',
            email: 'user2@test.com',
            password: 'hashedPassword456',
        }
    ],


    invalidData: {
        invalidEmail: {
            username: 'testUser',
            email: 'notAnEmail',
            password: 'Password123!'
        },
        emptyUsername: {
            username: '',
            email: 'test@test.com',
            password: 'Password123!'
        }
    }
}; 
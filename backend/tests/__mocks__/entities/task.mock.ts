export const taskMock = {
    validTask: {
        id: '1',
        title: 'Task 1',
        description: 'Description 1',
        user_id: '1',
        creation_date: new Date(),
        completed: false,
        completed_at: null
    },

    createTaskDto: {
        title: 'New Task',
        description: 'New Description',
        user_id: '1'
    },

    updateTaskDto: {
        id: '1',
        title: 'Updated Task 1',
        description: 'Updated Description 1',
        user_id: '1'
    },

    taskList: [
        {
            id: '1',
            title: 'Task 1',
            description: 'Description 1',
            user_id: '1',
            creation_date: new Date(),
            completed: false,
            completed_at: null
        },
        {
            id: '2',
            title: 'Task 2',
            description: 'Description 2',
            user_id: '2',
            creation_date: new Date(),
            completed: true,
            completed_at: new Date()
        }
    ],

    invalidData: {
        emptyTitle: {
            title: '',
            description: 'Description 1',
            user_id: '1'
        },
        emptyDescription: {
            title: 'Task 1',
            description: '',
            user_id: '1'
        },
        emptyUserId: {
            title: 'Task 1',
            description: 'Description 1',
            user_id: ''
        }
    }
};
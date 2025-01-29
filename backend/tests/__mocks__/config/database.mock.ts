import { userMock } from "../entities/user.mock";

export const poolMock = {
    query: jest.fn(),
    connect: jest.fn(),
    end: jest.fn(),
    on: jest.fn(),
};


export const queryResultMock = {
    success: {
        rows: [userMock.validUser],

        rowCount: 1
    },
    empty: {
        rows: [],
        rowCount: 0
    },
    multiple: {
        rows: userMock.userList,
        rowCount: 2
    }
}; 
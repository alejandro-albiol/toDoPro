import '@jest/globals';
import { poolMock } from './config/database.mock.js';

jest.mock('../../src/config/configDataBase.js', () => ({
    pool: poolMock
}));

process.on('unhandledRejection', (error) => {
    console.error('Unhandled Promise Rejection:', error);
}); 
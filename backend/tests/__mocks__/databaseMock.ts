export const mockPool = {
  query: jest.fn()
};

jest.mock('../../src/config/configDataBase', () => ({
  pool: mockPool
}));


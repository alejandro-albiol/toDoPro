import path from 'path';

// Usando __dirname directamente para tests
const rootPath =
  process.env.NODE_ENV === 'test'
    ? path.join(process.cwd(), 'dist')
    : path.join(process.cwd());

export const config = {
  rootPath,
};

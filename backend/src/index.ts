import app from './app.js';

if (process.env.NODE_ENV !== 'test') {
  app.listen(3000, () => {
    console.log('Server running on port 3000');
  });
}

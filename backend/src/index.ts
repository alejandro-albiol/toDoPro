import express from 'express';
import cors from 'cors';
import { config } from './configuration/config.js';
import ApiRouter from './routes/apiRouter.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(config.rootPath));

// API Routes
app.use('/api/v1', ApiRouter);

// Serve static files for all other routes
app.get('*', (req, res) => {
  res.sendFile('index.html', { root: config.rootPath });
});

// Start server
export const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app; 
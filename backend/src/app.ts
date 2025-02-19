import express from 'express';
import { errorHandler } from './middlewares/error-handler.js';
import swaggerUi from 'swagger-ui-express';
import { swaggerConfig } from './docs/swagger.config.js';
import path from 'path';
import apiRouter from './routes/api.routes.js';
import configureStaticRoutes from './routes/static.routes.js';
import { AiReccomendationController } from './ai/controller/ai-recommendation.controller.js';
import { configureAiRoutes } from './ai/routes/ai.routes.js';
import { AiRecommendationService } from './ai/service/ai-recommendation.service.js';

const aiService = new AiRecommendationService();
const aiController = new AiReccomendationController(aiService);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), '..', 'public')));

// API routes
app.use('/api/v1', apiRouter);
app.use("/recommendation", configureAiRoutes(aiController));

// Static routes
app.use(configureStaticRoutes());

// API documentation
app.use('/api-docs', swaggerUi.serve as unknown as express.RequestHandler[]);
app.use('/api-docs', swaggerUi.setup(swaggerConfig, { explorer: true }) as unknown as express.RequestHandler[]);

// Error handling
app.use(errorHandler);

export default app;
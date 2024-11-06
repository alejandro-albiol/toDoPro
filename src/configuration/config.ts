import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

export const app = express();
export const PORT = process.env.PORT || 3000;

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
export const publicPath = path.join(__dirname, '../../public');

app.use(express.json());
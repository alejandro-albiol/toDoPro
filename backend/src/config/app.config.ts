import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

interface AppConfig {
    env: string;
    rootPath: string;
    port: number;
    database: {
        host: string;
        port: number;
        name: string;
        user: string;
        password: string;
    };
}

const config: AppConfig = {
    env: process.env.NODE_ENV || 'development',
    rootPath: process.env.NODE_ENV === 'test' 
        ? path.join(process.cwd(), 'dist')
        : process.cwd(),
    port: parseInt(process.env.PORT || '3000'),
    database: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        name: process.env.DB_NAME || 'database',
        user: process.env.DB_USER || 'user',
        password: process.env.DB_PASSWORD || 'password'
    }
};

export { config }; 
import { IDatabasePool } from '../shared/interfaces/database-pool.interface.js';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const getDatabaseConfig = () => {
    const env = process.env.NODE_ENV || 'development';
    
    const baseConfig = {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    };

    const configs = {
        development: baseConfig,
        test: {
            ...baseConfig,
            database: process.env.TEST_DB_NAME || `${baseConfig.database}_test`
        },
        production: baseConfig
    };

    return configs[env] || configs.development;
};

export const createDatabasePool = (): IDatabasePool => {
    const config = getDatabaseConfig();
    return new pg.Pool(config);
};

export const pool: IDatabasePool = createDatabasePool(); 
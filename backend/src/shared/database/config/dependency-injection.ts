import { createDatabaseErrorAdapter } from '../factories/database-error-adapter.factory.js';
import { DatabaseErrorHandlerService } from '../services/database-error-handler.service.js';

export function configureDatabaseErrorHandler(): DatabaseErrorHandlerService {
  const dbEngine = process.env.DB_ENGINE || 'postgres';
  const errorAdapter = createDatabaseErrorAdapter(dbEngine);
  return new DatabaseErrorHandlerService(errorAdapter);
}


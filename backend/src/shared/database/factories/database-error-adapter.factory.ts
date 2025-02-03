import { IDatabaseErrorAdapter } from '../adapters/i-database-error-adapter.js';
import { PostgresErrorAdapter } from '../adapters/postgres-error-adapter.js';
import { MySQLErrorAdapter } from '../adapters/mysql-error-adapter.js';

const adapterRegistry: Record<string, IDatabaseErrorAdapter> = {
  postgres: new PostgresErrorAdapter(),
  mysql: new MySQLErrorAdapter(),
};

export function createDatabaseErrorAdapter(dbEngine: string): IDatabaseErrorAdapter {
  const adapter = adapterRegistry[dbEngine];
  if (!adapter) {
    throw new Error(`Unsupported database engine: ${dbEngine}`);
  }
  return adapter;
}

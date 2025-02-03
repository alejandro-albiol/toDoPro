import { IGenericDatabaseError } from '../exceptions/i-database-error.js';
import { PostgresErrorCode } from '../exceptions/enums/postgres-error-code.enum.js';
import { IDatabaseErrorAdapter } from './i-database-error-adapter.js';

export class PostgresErrorAdapter implements IDatabaseErrorAdapter {
  handle(error: any): IGenericDatabaseError {
    const codeMapping: Record<string, string> = {
      [PostgresErrorCode.UNIQUE_VIOLATION]: 'UNIQUE_VIOLATION',
      [PostgresErrorCode.NOT_NULL_VIOLATION]: 'NOT_NULL_VIOLATION',
      [PostgresErrorCode.FOREIGN_KEY_VIOLATION]: 'FOREIGN_KEY_VIOLATION',
      [PostgresErrorCode.INVALID_INPUT]: 'INVALID_INPUT',
      [PostgresErrorCode.NOT_FOUND]: 'NOT_FOUND',
      [PostgresErrorCode.UNDEFINED_COLUMN]: 'UNDEFINED_COLUMN',
    };

    return {
      code: codeMapping[error.code] || 'UNKNOWN_ERROR',
      message: error.message || 'Unknown database error',
      metadata: {
        detail: error.detail,
        constraint: error.constraint,
      },
    };
  }
}

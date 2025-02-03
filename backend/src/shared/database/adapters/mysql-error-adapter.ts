// backend/src/shared/database/adapters/mysql-error-adapter.ts
import { IGenericDatabaseError } from '../exceptions/i-database-error.js';
import { MySQLErrorCode } from '../exceptions/enums/mysql-error-code.enum.js';
import { IDatabaseErrorAdapter } from './i-database-error-adapter.js';

export class MySQLErrorAdapter implements IDatabaseErrorAdapter {
  handle(error: any): IGenericDatabaseError {
    const codeMapping: Record<string, string> = {
      [MySQLErrorCode.DUPLICATE_ENTRY]: 'DUPLICATE_ENTRY',
      [MySQLErrorCode.FOREIGN_KEY_CONSTRAINT]: 'FOREIGN_KEY_CONSTRAINT',
      [MySQLErrorCode.SYNTAX_ERROR]: 'SYNTAX_ERROR',
      [MySQLErrorCode.UNKNOWN_TABLE]: 'UNKNOWN_TABLE',
      [MySQLErrorCode.UNKNOWN_COLUMN]: 'UNKNOWN_COLUMN',
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
import { DatabaseError } from 'pg';
import { DbErrorCode } from '../exceptions/database/enum/db-error-code.enum.js';
import { IGenericDatabaseError } from '../models/interfaces/base/i-database-error.js';

export function formatDatabaseError(
  error: DatabaseError,
): IGenericDatabaseError {
  return {
    code: error.code as DbErrorCode,
    message: error.message,
    metadata: {
      detail: error.detail,
      constraint: error.constraint,
      table: error.table,
      column: error.column,
    },
  };
}

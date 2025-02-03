import { IGenericDatabaseError } from '../exceptions/i-database-error.js';
import { DataBaseException } from '../exceptions/database.exception.js';
import { PostgresErrorCode } from '../exceptions/enums/postgres-error-code.enum.js';
import { IDatabaseErrorAdapter } from '../adapters/i-database-error-adapter.js';

export class DatabaseErrorHandlerService {
  constructor(private errorAdapter: IDatabaseErrorAdapter) {}

  handle(error: any): IGenericDatabaseError {
    return this.errorAdapter.handle(error);
  }

  throwAsException(error: any): never {
    const genericError = this.handle(error);
    throw new DataBaseException(
      genericError.message,
      genericError.code as PostgresErrorCode,
      genericError.metadata
    );
  }
}

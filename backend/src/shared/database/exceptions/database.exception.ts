import { PostgresErrorCode } from './enums/postgres-error-code.enum.js';
import { IGenericDatabaseError } from './i-database-error.js';

export class DataBaseException extends Error implements IGenericDatabaseError {
  public readonly code: string;
  public readonly metadata?: {
    detail?: string;
    constraint?: string;
    column?: string;
    table?: string;
    [key: string]: any;
  };

  constructor(
    message: string,
    code: PostgresErrorCode,
    metadata?: {
      detail?: string;
      constraint?: string;
      column?: string;
      table?: string;
      [key: string]: any;
    }
  ) {
    super(message);
    this.name = 'DatabaseException';
    this.code = code;
    this.metadata = metadata;
  }

  toString(): string {
    return `${this.name}: ${this.message} (Code: ${this.code})`;
  }

  logError(): void {
    console.error(this.toString(), this.metadata);
  }
}


import { DataBaseErrorCode } from './enums/data-base-error-code.enum.js';

export class DataBaseException extends Error {
  constructor(
    message: string,
    public readonly code: DataBaseErrorCode,
    public readonly metadata?: {
      detail?: string;
      constraint?: string;
      column?: string;
      table?: string;
    }
  ) {
    super(message);
    this.name = 'DatabaseException';
  }
}


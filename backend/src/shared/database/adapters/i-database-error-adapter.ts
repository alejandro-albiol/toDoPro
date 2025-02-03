import { IGenericDatabaseError } from '../exceptions/i-database-error.js';

export interface IDatabaseErrorAdapter {
  handle(error: any): IGenericDatabaseError;
}
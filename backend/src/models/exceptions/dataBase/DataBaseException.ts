import { BaseException } from "../base/BaseException.js";

export class DatabaseException extends BaseException {
  constructor(operation: string, entity: string) {
    super(
      `Database ${operation} failed for ${entity}`,
      500,
      'DATABASE_ERROR'
    );
  }
}
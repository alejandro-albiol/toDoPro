import { BaseException } from "../base/BaseException.js";

export class ConflictException extends BaseException {
  constructor(entity: string, field: string) {
    super(
      `${entity} with this ${field} already exists`,
      409,
      'CONFLICT_ERROR'
    );
  }
}
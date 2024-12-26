import { BaseException } from '../base/BaseException.js';

export class ValidationException extends BaseException {
  constructor(entity: string, field: string) {
    super(`Invalid ${entity} data: ${field}`, 400, 'VALIDATION_ERROR');
  }
}

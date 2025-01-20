import { ValidationException } from '../ValidationException.js';

export class TaskValidationException extends ValidationException {
  constructor(field: string) {
    super('Task', field);
  }
}

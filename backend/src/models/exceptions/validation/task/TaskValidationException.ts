import { ValidationException } from '../ValidationException';

export class TaskValidationException extends ValidationException {
  constructor(field: string) {
    super('Task', field);
  }
}

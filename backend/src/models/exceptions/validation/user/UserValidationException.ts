import { ValidationException } from "../ValidationException.js";

export class UserValidationException extends ValidationException {
  constructor(field: string) {
    super('User', field);
  }
} 
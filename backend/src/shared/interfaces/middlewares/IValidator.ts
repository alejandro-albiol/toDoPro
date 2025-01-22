import { RequestHandler } from 'express';

export interface IValidator {
  validateCreate(): RequestHandler;
  validateUpdate(): RequestHandler;
  validateDelete(): RequestHandler;
}


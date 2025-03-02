import { AiException } from './ai-base.exception.js';
import { AiErrorCodes } from './enum/ai-error-codes.enum.js';

export class AiConnectionError extends AiException {
  constructor(message: string) {
    super(message, 500, AiErrorCodes.CONNECTION_ERROR);
  }
}

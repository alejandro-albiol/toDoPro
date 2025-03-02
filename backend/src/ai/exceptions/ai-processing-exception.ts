import { AiException } from './ai-base.exception.js';
import { AiErrorCodes } from './enum/ai-error-codes.enum.js';

export class AiProcessingException extends AiException {
  constructor(message: string) {
    super(message, 500, AiErrorCodes.GENERATING_RECOMMENDATION_ERROR);
  }
}

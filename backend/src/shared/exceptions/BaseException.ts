import { ErrorCode } from './ErrorCode.enum';

export class BaseException extends Error {
  constructor(
    public message: string,
    public errorCode: ErrorCode,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

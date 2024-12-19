export class BaseException extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public errorCode: string,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

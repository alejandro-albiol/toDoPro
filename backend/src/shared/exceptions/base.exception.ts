export abstract class BaseException extends Error {
  constructor(
    message: string,
    public  statusCode: number,
    public readonly errorCode: string,
    public readonly detail?: string
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

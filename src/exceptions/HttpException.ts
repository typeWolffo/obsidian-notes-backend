export class HttpException extends Error {
  constructor(public statusCode: number, public message: string) {
    super(message);
    Object.setPrototypeOf(this, HttpException.prototype);
  }
}

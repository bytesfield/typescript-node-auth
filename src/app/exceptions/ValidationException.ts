
import config from "../../config";

export default class ValidationException extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string) {
    super(message);
    this.statusCode = config.http.code.VALIDATION_ERROR;
    this.isOperational = true;

    //Error.captureStackTrace(this, this.constructor);
  }
}

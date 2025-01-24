import { StatusCodes } from "http-status-codes";

export class HttpResponse<T = null> {
  readonly success: boolean;
  readonly message: string;
  readonly responseObject: T;
  readonly statusCode: number;

  private constructor(success: boolean, message: string, responseObject: T, statusCode: number) {
    this.success = success;
    this.message = message;
    this.responseObject = responseObject;
    this.statusCode = statusCode;
  }

  static success<T>(message: string, responseObject: T, statusCode: number = StatusCodes.OK) {
    return new HttpResponse(true, message, responseObject, statusCode);
  }

  static failure<T>(message: string, responseObject: T, statusCode: number = StatusCodes.BAD_REQUEST) {
    return new HttpResponse(false, message, responseObject, statusCode);
  }

  static unavailable<T>(message: string, responseObject: T, statusCode: number = StatusCodes.SERVICE_UNAVAILABLE) {
    return new HttpResponse(false, message, responseObject, statusCode);
  }

  static internalServerError<T>(
    message: string,
    responseObject: T,
    statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR,
  ) {
    return new HttpResponse(false, message, responseObject, statusCode);
  }

  static unauthorized<T>(message: string, responseObject: T, statusCode: number = StatusCodes.UNAUTHORIZED) {
    return new HttpResponse(false, message, responseObject, statusCode);
  }
}

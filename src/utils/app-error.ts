export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;

  constructor(statusCode: number, code: string, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    Object.setPrototypeOf(this, AppError.prototype);
  }

  static notFound(resource: string): AppError {
    return new AppError(404, "NOT_FOUND", `${resource} not found`);
  }

  static badRequest(message: string): AppError {
    return new AppError(400, "BAD_REQUEST", message);
  }

  static conflict(message: string): AppError {
    return new AppError(409, "CONFLICT", message);
  }
}

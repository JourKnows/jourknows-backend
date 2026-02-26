import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  logger.error(err);

  // Zod Validation Errors
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid request data",
        details: err.errors,
      }
    });
    return;
  }

  // Handle specific known errors (e.g., from DB or Auth)
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    res.status(401).json({
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Invalid or expired token",
      }
    });
    return;
  }

  // Default to 500 Internal Server Error
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: {
      code: err.code || "INTERNAL_SERVER_ERROR",
      message: statusCode === 500 ? "Internal Server Error" : err.message,
    }
  });
};

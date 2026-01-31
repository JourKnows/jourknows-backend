
import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});

export const errorHandler = (err: unknown, req: Request, res: Response, _next: NextFunction) => {
  logger.error(err);

  if (err instanceof ZodError) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation Error',
      errors: err.issues,
    });
  }

  res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
};

import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

/**
 * Express middleware factory that validates req.body against a Zod schema.
 * On validation failure, passes the ZodError to the global error handler.
 */
export const validateBody = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      next(result.error);
      return;
    }
    req.body = result.data;
    next();
  };
};

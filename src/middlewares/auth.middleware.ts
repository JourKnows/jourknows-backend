import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const requireAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader?.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "No authentication token provided",
        },
      });
      return;
    }

    const token = authHeader.split(" ")[1];

    if (!config.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const decoded = jwt.verify(token, config.JWT_SECRET) as {
      id: string;
      role: string;
    };

    req.user = decoded;
    next();
  } catch (error) {
    // If it's a JWT error, pass it to the global error handler
    // which we already configured to return a 401
    next(error);
  }
};

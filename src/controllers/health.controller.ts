import { Request, Response } from "express";
import { db } from "../db";
import { sql } from "drizzle-orm";

export const getHealth = (req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
};

export const getDbHealth = async (req: Request, res: Response) => {
  try {
    // Perform a lightweight query to verify the connection
    await db.execute(sql`SELECT 1`);
    
    res.status(200).json({
      success: true,
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Health Check DB Error:", error);
    res.status(503).json({
      success: false,
      database: "disconnected",
      error: error instanceof Error ? error.message : "Unknown database error",
    });
  }
};

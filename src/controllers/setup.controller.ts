import { Request, Response, NextFunction } from "express";
import { db } from "../db";
import { users, profiles } from "../db/schema";
import { eq } from "drizzle-orm";
import { createClient } from "@supabase/supabase-js";
import { config } from "../config";
import { z } from "zod";

export const setupFirstAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // 1. Security Check: Are there any admins already?
    const existingAdmins = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.role, "admin"))
      .limit(1);

    if (existingAdmins.length > 0) {
      res.status(403).json({
        success: false,
        error: {
          code: "FORBIDDEN",
          message: "An admin already exists. Setup endpoint is locked.",
        },
      });
      return;
    }

    // 2. Validate Input
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(8),
      fullName: z.string().min(2),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          details: parsed.error.issues,
        },
      });
      return;
    }

    const { email, password, fullName } = parsed.data;

    // 3. Ensure Supabase credentials exist
    if (!config.SUPABASE_URL || !config.SUPABASE_SERVICE_ROLE_KEY) {
      res.status(500).json({
        success: false,
        error: {
          code: "SERVER_CONFIGURATION_ERROR",
          message:
            "Supabase Admin keys are missing from the environment variables.",
        },
      });
      return;
    }

    const supabaseAdmin = createClient(
      config.SUPABASE_URL,
      config.SUPABASE_SERVICE_ROLE_KEY,
    );

    // 4. Create the User in Supabase Auth
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (authError || !authData.user) {
      res.status(400).json({
        success: false,
        error: {
          code: "AUTH_CREATION_FAILED",
          message: authError?.message || "Failed to create user in Auth",
        },
      });
      return;
    }

    const userId = authData.user.id;

    // 5. Insert into our custom Drizzle Schema inside a transaction
    await db.transaction(async (tx) => {
      await tx.insert(users).values({
        id: userId,
        email,
        role: "admin",
      });

      await tx.insert(profiles).values({
        id: userId,
        fullName: fullName,
      });
    });

    res.status(201).json({
      success: true,
      message: "First admin created successfully. Setup route is now locked.",
      user: {
        id: userId,
        email,
        role: "admin",
      },
    });
  } catch (error) {
    next(error);
  }
};

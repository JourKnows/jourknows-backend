import inquirer from "inquirer";
import { createClient } from "@supabase/supabase-js";
import { db } from "../db";
import { users, profiles } from "../db/schema";
import { eq } from "drizzle-orm";
// Load env vars manually since this script runs outside the main express app lifecycle
import * as dotenv from "dotenv";
dotenv.config();

const seedAdmin = async () => {
  console.log("===================================");
  console.log("👑 JourKnows - First Admin Setup");
  console.log("===================================");

  try {
    // 1. Initial checks
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error(
        "❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env file."
      );
      process.exit(1);
    }

    const { proceed } = await inquirer.prompt([
      {
        type: "confirm",
        name: "proceed",
        message: "This will check the live database for existing admins. Proceed?",
        default: true,
      },
    ]);

    if (!proceed) {
      console.log("Setup cancelled.");
      process.exit(0);
    }

    // 2. Security Check: Are there any admins already?
    console.log("Checking database...");
    const existingAdmins = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.role, "admin"))
      .limit(1);

    if (existingAdmins.length > 0) {
      console.error(
        "❌ An admin account already exists in the database. Setup script is permanently locked."
      );
      process.exit(1);
    }

    // 3. Prompt for Admin Details
    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "fullName",
        message: "Admin Full Name:",
        validate: (input) => input.length >= 2 || "Name must be at least 2 characters.",
      },
      {
        type: "input",
        name: "email",
        message: "Admin Email Address:",
        validate: (input) =>
          /^\S+@\S+\.\S+$/.test(input) || "Please enter a valid email address.",
      },
      {
        type: "password",
        name: "password",
        message: "Admin Password (Min 8 characters):",
        mask: "*",
        validate: (input) => input.length >= 8 || "Password must be at least 8 characters.",
      },
    ]);

    console.log("Creating user in Supabase Auth...");
    const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

    // 4. Create the User in Supabase Auth
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email: answers.email,
        password: answers.password,
        email_confirm: true,
      });

    if (authError || !authData.user) {
      console.error("❌ Failed to create user in Auth:", authError?.message);
      process.exit(1);
    }

    const userId = authData.user.id;
    console.log("✅ Supabase Auth created successfully.");
    console.log(`Syncing user [${userId}] to PostgreSQL DB...`);

    // 5. Insert into our custom Drizzle Schema
    await db.transaction(async (tx) => {
      await tx.insert(users).values({
        id: userId,
        email: answers.email,
        role: "admin",
      });

      await tx.insert(profiles).values({
        id: userId,
        fullName: answers.fullName,
      });
    });

    console.log("🎉 Success! The first admin has been seeded.");
    console.log(`You can now log into the CMS using: ${answers.email}`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Unexpected Error during setup:", error);
    process.exit(1);
  }
};

seedAdmin();

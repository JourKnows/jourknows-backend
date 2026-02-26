import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const runMigration = async () => {
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL is not set. Skipping migrations.");
    return;
  }

  console.info("⏳ Running database migrations...");

  // Supabase (and many managed DBs) require SSL for external connections
  const isProduction = process.env.NODE_ENV === "production";
  const useSSL = isProduction || process.env.DATABASE_URL.includes('sslmode=require');

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 1, // Only need 1 connection for migrations
    ssl: useSSL ? { rejectUnauthorized: false } : undefined,
  });

  const db = drizzle(pool);

  try {
    // This will run migrations located in the 'drizzle' folder
    // which is copied into the Docker container
    await migrate(db, { migrationsFolder: "./drizzle" });
    console.info("✅ Database migrations applied successfully!");
  } catch (error) {
    console.error("❌ Error running database migrations:", error);
    process.exit(1); // Fail the boot process if migrations fail
  } finally {
    await pool.end();
  }
};

runMigration();

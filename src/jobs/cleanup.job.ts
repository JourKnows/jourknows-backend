import cron from "node-cron";
import { db } from "../db";
import { articles } from "../db/schema";
import { lt } from "drizzle-orm";

// Run every day at midnight
export const startCleanupJob = () => {
  cron.schedule("0 0 * * *", async () => {
    console.info("🧹 Running Application Cleanup Job...");
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const deleted = await db
        .delete(articles)
        .where(lt(articles.createdAt, thirtyDaysAgo))
        .returning({ id: articles.id });

      console.info(
        `✅ Cleanup Complete: Deleted ${deleted.length} old articles.`,
      );
    } catch (error) {
      console.error("❌ Cleanup Job Failed:", error);
    }
  });
};

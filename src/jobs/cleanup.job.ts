import cron from "node-cron";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Run every day at midnight
export const startCleanupJob = () => {
  cron.schedule("0 0 * * *", async () => {
    console.info("🧹 Running Application Cleanup Job...");
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const deleted = await prisma.article.deleteMany({
        where: {
          createdAt: {
            lt: thirtyDaysAgo,
          },
        },
      });

      console.info(
        `✅ Cleanup Complete: Deleted ${deleted.count} old articles.`,
      );
    } catch (error) {
      console.error("❌ Cleanup Job Failed:", error);
    }
  });
};

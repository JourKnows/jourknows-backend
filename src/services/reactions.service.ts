import { db } from "../db";
import { reactions, articles } from "../db/schema";
import { eq, sql } from "drizzle-orm";
import { AppError } from "../utils/app-error";

const REACTION_TYPES = ["like", "love", "haha", "wow", "sad", "angry"] as const;

export async function getReactionCounts(articleId: string) {
  // Verify article exists
  const article = await db.query.articles.findFirst({
    where: eq(articles.id, articleId),
    columns: { id: true },
  });

  if (!article) {
    throw AppError.notFound("Article");
  }

  const results = await db
    .select({
      type: reactions.type,
      count: sql<number>`count(*)::int`,
    })
    .from(reactions)
    .where(eq(reactions.articleId, articleId))
    .groupBy(reactions.type);

  // Build response with all 6 keys defaulting to 0
  const counts: Record<string, number> = {};
  for (const type of REACTION_TYPES) {
    counts[type] = 0;
  }
  for (const row of results) {
    counts[row.type] = row.count;
  }

  return counts;
}

export async function upsertReaction(userId: string, articleId: string, type: typeof REACTION_TYPES[number]) {
  // Verify article exists
  const article = await db.query.articles.findFirst({
    where: eq(articles.id, articleId),
    columns: { id: true },
  });

  if (!article) {
    throw AppError.notFound("Article");
  }

  // Upsert: insert or update the reaction type using composite PK
  await db
    .insert(reactions)
    .values({ userId, articleId, type })
    .onConflictDoUpdate({
      target: [reactions.userId, reactions.articleId],
      set: { type },
    });

  return { success: true };
}

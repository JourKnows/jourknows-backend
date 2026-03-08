import { db } from "../db";
import { categories } from "../db/schema";
import { eq } from "drizzle-orm";

export async function listActiveCategories() {
  const results = await db.query.categories.findMany({
    where: eq(categories.isActive, true),
    orderBy: categories.name,
  });

  return { categories: results };
}

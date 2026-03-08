import { Router, Request, Response, NextFunction } from "express";
import { db } from "../db";
import { articles } from "../db/schema";
import { eq, desc } from "drizzle-orm";

const router = Router();

// GET /api/v1/sitemap.xml — Dynamic XML sitemap of published articles
router.get("/sitemap.xml", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const siteUrl = process.env.FRONTEND_URL || "https://jourknows-frontend-prod.onrender.com";

    const publishedArticles = await db
      .select({
        slug: articles.slug,
        updatedAt: articles.updatedAt,
      })
      .from(articles)
      .where(eq(articles.isPublished, true))
      .orderBy(desc(articles.publishedAt));

    const urls = publishedArticles.map(
      (a) =>
        `  <url>\n    <loc>${siteUrl}/article/${a.slug}</loc>\n    <lastmod>${a.updatedAt ? new Date(a.updatedAt).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]}</lastmod>\n  </url>`,
    );

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
  </url>
${urls.join("\n")}
</urlset>`;

    res.set("Content-Type", "application/xml");
    res.send(xml);
  } catch (error) {
    next(error);
  }
});

export default router;

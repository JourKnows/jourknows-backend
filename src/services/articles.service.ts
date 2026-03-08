import { db } from "../db";
import { articles, categories } from "../db/schema";
import { eq, and, desc, count } from "drizzle-orm";
import { AppError } from "../utils/app-error";

interface ArticleListParams {
  categorySlug?: string | null;
  page: number;
  limit: number;
  offset: number;
}

function flattenArticle(raw: any) {
  return {
    id: raw.id,
    title: raw.title,
    slug: raw.slug,
    contentHtml: raw.contentHtml,
    excerpt: raw.excerpt,
    coverImageUrl: raw.coverImageUrl,
    isPublished: raw.isPublished,
    publishedAt: raw.publishedAt,
    categoryId: raw.categoryId,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    author: raw.author?.profile
      ? {
          fullName: raw.author.profile.fullName,
          avatarUrl: raw.author.profile.avatarUrl,
          bio: raw.author.profile.bio,
        }
      : { fullName: null, avatarUrl: null, bio: null },
    category: raw.category
      ? { id: raw.category.id, name: raw.category.name, slug: raw.category.slug }
      : null,
    tags: (raw.tags || []).map((at: any) => ({
      name: at.tag.name,
      slug: at.tag.slug,
    })),
  };
}

export async function listPublishedArticles({ categorySlug, page, limit, offset }: ArticleListParams) {
  // Build filter conditions
  const conditions = [eq(articles.isPublished, true)];

  // If filtering by category, look up the category ID first
  if (categorySlug) {
    const category = await db.query.categories.findFirst({
      where: eq(categories.slug, categorySlug),
    });
    if (category) {
      conditions.push(eq(articles.categoryId, category.id));
    } else {
      // Category not found — return empty results
      return { articles: [], total: 0, page };
    }
  }

  // Get total count
  const [countResult] = await db
    .select({ total: count() })
    .from(articles)
    .where(and(...conditions));

  const total = countResult?.total ?? 0;

  // Get articles with relations
  const results = await db.query.articles.findMany({
    where: and(...conditions),
    with: {
      author: {
        with: { profile: true },
      },
      category: true,
      tags: {
        with: { tag: true },
      },
    },
    orderBy: desc(articles.publishedAt),
    limit,
    offset,
  });

  return {
    articles: results.map(flattenArticle),
    total,
    page,
  };
}

export async function getArticleBySlug(slug: string) {
  const result = await db.query.articles.findFirst({
    where: and(eq(articles.slug, slug), eq(articles.isPublished, true)),
    with: {
      author: {
        with: { profile: true },
      },
      category: true,
      tags: {
        with: { tag: true },
      },
    },
  });

  if (!result) {
    throw AppError.notFound("Article");
  }

  return flattenArticle(result);
}

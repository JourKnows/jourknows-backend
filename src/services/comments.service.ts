import { db } from "../db";
import { comments, articles } from "../db/schema";
import { eq, and, isNull, desc, count } from "drizzle-orm";
import { AppError } from "../utils/app-error";
import type { SubmitCommentInput } from "../validators/comments.schema";

function formatComment(raw: any) {
  return {
    id: raw.id,
    articleId: raw.articleId,
    guestName: raw.guestName,
    content: raw.content,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    parentId: raw.parentId,
    author: raw.author?.profile
      ? {
          fullName: raw.author.profile.fullName,
          avatarUrl: raw.author.profile.avatarUrl,
        }
      : null,
    replies: (raw.replies || []).map(formatComment),
  };
}

export async function listComments(articleId: string, page: number, limit: number, offset: number) {
  // Verify article exists
  const article = await db.query.articles.findFirst({
    where: eq(articles.id, articleId),
    columns: { id: true },
  });

  if (!article) {
    throw AppError.notFound("Article");
  }

  // Count top-level comments
  const [countResult] = await db
    .select({ total: count() })
    .from(comments)
    .where(and(eq(comments.articleId, articleId), isNull(comments.parentId)));

  const total = countResult?.total ?? 0;

  // Fetch top-level comments with one level of replies
  const results = await db.query.comments.findMany({
    where: and(eq(comments.articleId, articleId), isNull(comments.parentId)),
    with: {
      author: {
        with: { profile: true },
      },
      replies: {
        with: {
          author: {
            with: { profile: true },
          },
        },
        orderBy: comments.createdAt,
      },
    },
    orderBy: desc(comments.createdAt),
    limit,
    offset,
  });

  return {
    comments: results.map(formatComment),
    total,
  };
}

export async function createComment(articleId: string, input: SubmitCommentInput) {
  // Verify article exists
  const article = await db.query.articles.findFirst({
    where: eq(articles.id, articleId),
    columns: { id: true },
  });

  if (!article) {
    throw AppError.notFound("Article");
  }

  // Verify parentId exists if provided
  if (input.parentId) {
    const parentComment = await db.query.comments.findFirst({
      where: and(eq(comments.id, input.parentId), eq(comments.articleId, articleId)),
      columns: { id: true },
    });

    if (!parentComment) {
      throw AppError.notFound("Parent comment");
    }
  }

  const [newComment] = await db
    .insert(comments)
    .values({
      articleId,
      guestName: input.guestName,
      content: input.content,
      parentId: input.parentId || null,
    })
    .returning();

  return {
    id: newComment.id,
    articleId: newComment.articleId,
    guestName: newComment.guestName,
    content: newComment.content,
    createdAt: newComment.createdAt,
    parentId: newComment.parentId,
    replies: [],
  };
}

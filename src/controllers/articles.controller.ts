import { Request, Response, NextFunction } from "express";
import * as articlesService from "../services/articles.service";
import { parsePagination } from "../utils/pagination";

export const listArticles = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { page, limit, offset } = parsePagination(req.query as { page?: string });
    const categorySlug = (req.query.category as string) || null;

    const result = await articlesService.listPublishedArticles({
      categorySlug,
      page,
      limit,
      offset,
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getArticleBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const article = await articlesService.getArticleBySlug(req.params.slug as string);
    res.json(article);
  } catch (error) {
    next(error);
  }
};

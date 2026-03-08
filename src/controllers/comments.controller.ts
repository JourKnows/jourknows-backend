import { Request, Response, NextFunction } from "express";
import * as commentsService from "../services/comments.service";
import { parsePagination } from "../utils/pagination";

export const listComments = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { page, limit, offset } = parsePagination(req.query as { page?: string });
    const articleId = req.params.articleId as string;

    const result = await commentsService.listComments(articleId, page, limit, offset);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const createComment = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const articleId = req.params.articleId as string;
    const result = await commentsService.createComment(articleId, req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

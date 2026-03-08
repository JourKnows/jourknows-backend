import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import * as reactionsService from "../services/reactions.service";

export const getReactions = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const counts = await reactionsService.getReactionCounts(req.params.articleId as string);
    res.json(counts);
  } catch (error) {
    next(error);
  }
};

export const submitReaction = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { articleId } = req.params as { articleId: string };
    const { type } = req.body;

    const result = await reactionsService.upsertReaction(userId, articleId, type);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

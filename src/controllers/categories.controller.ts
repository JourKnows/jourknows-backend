import { Request, Response, NextFunction } from "express";
import * as categoriesService from "../services/categories.service";

export const listCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await categoriesService.listActiveCategories();
    res.json(result);
  } catch (error) {
    next(error);
  }
};

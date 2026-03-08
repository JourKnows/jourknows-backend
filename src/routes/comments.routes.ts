import { Router } from "express";
import { listComments, createComment } from "../controllers/comments.controller";
import { validateBody } from "../middlewares/validate.middleware";
import { submitCommentSchema } from "../validators/comments.schema";

const router = Router();

// GET /api/v1/articles/:articleId/comments?page=1
router.get("/:articleId/comments", listComments);

// POST /api/v1/articles/:articleId/comments (public — guest comments)
router.post(
  "/:articleId/comments",
  validateBody(submitCommentSchema),
  createComment,
);

export default router;

import { Router } from "express";
import { getReactions, submitReaction } from "../controllers/reactions.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { validateBody } from "../middlewares/validate.middleware";
import { submitReactionSchema } from "../validators/reactions.schema";

const router = Router();

// GET /api/v1/articles/:articleId/reactions
router.get("/:articleId/reactions", getReactions);

// POST /api/v1/articles/:articleId/reactions (requires auth)
router.post(
  "/:articleId/reactions",
  requireAuth,
  validateBody(submitReactionSchema),
  submitReaction,
);

export default router;

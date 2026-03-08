import { Router } from "express";
import { listArticles, getArticleBySlug } from "../controllers/articles.controller";

const router = Router();

// GET /api/v1/articles?category=slug&page=1
router.get("/", listArticles);

// GET /api/v1/articles/:slug
router.get("/:slug", getArticleBySlug);

export default router;

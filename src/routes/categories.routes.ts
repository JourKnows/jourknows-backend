import { Router } from "express";
import { listCategories } from "../controllers/categories.controller";

const router = Router();

// GET /api/v1/categories
router.get("/", listCategories);

export default router;

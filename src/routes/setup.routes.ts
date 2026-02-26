import { Router } from "express";
import { setupFirstAdmin } from "../controllers/setup.controller";

const router = Router();

router.post("/first-admin", setupFirstAdmin);

export default router;

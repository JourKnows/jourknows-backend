import express from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "./config";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();

// Middlewares
app.use(helmet());
app.use(cors({
  origin: config.CORS_ORIGIN ? config.CORS_ORIGIN.split(",") : "*",
  credentials: true,
}));
app.use(express.json());

// Routes
import healthRoutes from "./routes/health.routes";
import apiV1Routes from "./routes";

// Infrastructure checks
app.use("/health", healthRoutes);

// Versioned API Routes (Backend Team builds here)
app.use("/api/v1", apiV1Routes);

// Global Error Handler
app.use(errorHandler);

export default app;

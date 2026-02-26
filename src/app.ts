import express from "express";
import cors from "cors";
import helmet from "helmet";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
import healthRoutes from "./routes/health.routes";
import setupRoutes from "./routes/setup.routes";

app.use("/health", healthRoutes);
app.use("/api/setup", setupRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;

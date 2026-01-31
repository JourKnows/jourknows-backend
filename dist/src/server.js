"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = require("./config");
const redis_1 = require("./utils/redis");
const cleanup_job_1 = require("./jobs/cleanup.job");
const startServer = async () => {
    try {
        // Connect to external services
        await (0, redis_1.connectRedis)();
        // Start background jobs
        (0, cleanup_job_1.startCleanupJob)();
        app_1.default.listen(config_1.config.PORT, () => {
            console.info(`🚀 Server running on http://localhost:${config_1.config.PORT} in ${config_1.config.NODE_ENV} mode`);
        });
    }
    catch (error) {
        console.error('❌ Error starting server:', error);
        process.exit(1);
    }
};
startServer();

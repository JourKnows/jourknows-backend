
import app from './app';
import { config } from './config';
import { connectRedis } from './utils/redis';
import { startCleanupJob } from './jobs/cleanup.job';

const startServer = async () => {
  try {
    // Connect to external services
    await connectRedis();
    
    // Start background jobs
    startCleanupJob();

    app.listen(config.PORT, () => {
      console.info(`🚀 Server running on http://localhost:${config.PORT} in ${config.NODE_ENV} mode`);
    });
  } catch (error) {
    console.error('❌ Error starting server:', error);
    process.exit(1);
  }
};

startServer();

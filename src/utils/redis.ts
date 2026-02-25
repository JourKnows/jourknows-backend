import { createClient } from "redis";
import { config } from "../config";

const redisClient = createClient({
  url: config.REDIS_URL,
});

redisClient.on("error", (err) => console.error("❌ Redis Client Error", err));
redisClient.on("connect", () => console.info("🔌 Connected to Redis"));

export const connectRedis = async () => {
  if (!config.REDIS_URL) {
    console.warn("⚠️ No REDIS_URL provided, skipping Redis connection.");
    return;
  }
  await redisClient.connect();
};

export default redisClient;

import { createClient, RedisClientType } from "redis";
import { config } from "../config";

let redisClient: RedisClientType | null = null;

export const connectRedis = async () => {
  if (!config.REDIS_URL) {
    console.warn("⚠️ No REDIS_URL provided, skipping Redis connection.");
    return;
  }

  redisClient = createClient({
    url: config.REDIS_URL,
  });

  redisClient.on("error", (err) => console.error("❌ Redis Client Error", err));
  redisClient.on("connect", () => console.info("🔌 Connected to Redis"));

  await redisClient.connect();
};

export const getRedisClient = () => redisClient;

export default redisClient;

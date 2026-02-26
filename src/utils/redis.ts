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
    socket: {
      reconnectStrategy: (retries: number) => {
        if (retries > 3) {
          console.warn("⚠️ Redis reconnect failed after 3 attempts, giving up.");
          return false; // stop reconnecting
        }
        return Math.min(retries * 500, 3000);
      },
    },
  });

  redisClient.on("error", (err) => console.error("❌ Redis Client Error:", err.message));
  redisClient.on("connect", () => console.info("🔌 Connected to Redis"));

  await redisClient.connect();
};

export const getRedisClient = () => redisClient;

export default redisClient;

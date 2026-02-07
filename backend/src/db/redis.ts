import { createClient } from "redis";
import { REDIS_URL } from "../config/env.js";

const redisClient = createClient({ url: REDIS_URL });

redisClient.on("error", (error) => {
  console.error("Redis error:", error);
});

export async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
}

export async function disconnectRedis() {
  if (redisClient.isOpen) {
    await redisClient.quit();
  }
}

export { redisClient };

import { Redis } from "@upstash/redis";

let redis: Redis | null = null;

export function getRedisClient() {
  let url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    throw new Error("Upstash Redis environment variables are not configured");
  }

  if (!redis) {
    redis = new Redis({ url, token });
  }

  return redis;
}

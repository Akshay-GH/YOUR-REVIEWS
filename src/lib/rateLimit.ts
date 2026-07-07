import { getRedisClient } from "@/lib/redis";

const WINDOW_SECONDS = 60 * 60;
const PER_LINK_LIMIT = 5;
const GLOBAL_IP_LIMIT = 20;

export type RateLimitResult = {
  allowed: boolean;
  reason?: "per-link" | "global";
};

type RequestWithConnection = Request & {
  ip?: string;
  socket?: {
    remoteAddress?: string;
  };
  connection?: {
    remoteAddress?: string;
  };
};

export function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");

  if (realIp) {
    return realIp.trim();
  }

  const requestWithConnection = request as RequestWithConnection;

  return (
    requestWithConnection.ip ||
    requestWithConnection.socket?.remoteAddress ||
    requestWithConnection.connection?.remoteAddress ||
    "unknown"
  );
}

async function incrementWindowCounter(key: string) {
  const redis = getRedisClient();
  const count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, WINDOW_SECONDS);
  }

  return count;
}

export async function checkRateLimit(
  ip: string,
  linkId: string,
): Promise<RateLimitResult> {
  try {
    // Per-link limit stops one IP from flooding a single user's public inbox.
    const perLinkCount = await incrementWindowCounter(`rl:link:${ip}:${linkId}`);

    if (perLinkCount > PER_LINK_LIMIT) {
      return { allowed: false, reason: "per-link" };
    }

    // Global limit stops one IP from spraying messages across many public links.
    const globalIpCount = await incrementWindowCounter(`rl:ip:${ip}`);

    if (globalIpCount > GLOBAL_IP_LIMIT) {
      return { allowed: false, reason: "global" };
    }

    return { allowed: true };
  } catch (error) {
    console.error("Rate limit check failed", error);

    return { allowed: true };
  }
}

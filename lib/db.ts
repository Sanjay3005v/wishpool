import { Redis } from "@upstash/redis";
import { BirthdayPool } from "./types";
import fs from "fs";
import path from "path";

// Initialize Upstash Redis if credentials exist
const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

const redis = redisUrl && redisToken
  ? new Redis({
      url: redisUrl,
      token: redisToken,
    })
  : null;

// Local fallback store for offline/local development when Redis credentials aren't set yet
const localDataDir = path.join(process.cwd(), ".data");
const localFilePath = path.join(localDataDir, "pools.json");

function getLocalStore(): Record<string, BirthdayPool> {
  try {
    if (!fs.existsSync(localDataDir)) {
      fs.mkdirSync(localDataDir, { recursive: true });
    }
    if (!fs.existsSync(localFilePath)) {
      fs.writeFileSync(localFilePath, JSON.stringify({}), "utf8");
      return {};
    }
    const data = fs.readFileSync(localFilePath, "utf8");
    return JSON.parse(data || "{}");
  } catch (err) {
    console.warn("Local storage read error, falling back to empty map:", err);
    return {};
  }
}

function saveLocalStore(data: Record<string, BirthdayPool>): void {
  try {
    if (!fs.existsSync(localDataDir)) {
      fs.mkdirSync(localDataDir, { recursive: true });
    }
    fs.writeFileSync(localFilePath, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.warn("Local storage write error:", err);
  }
}

// In-memory rate limiting map for fallback
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

/**
 * Fetch a birthday pool by slug
 */
export async function getPoolBySlug(slug: string): Promise<BirthdayPool | null> {
  const key = `pool:${slug}`;
  if (redis) {
    const data = await redis.get<BirthdayPool>(key);
    return data || null;
  }
  const store = getLocalStore();
  return store[slug] || null;
}

/**
 * Save or update a birthday pool
 */
export async function savePool(pool: BirthdayPool): Promise<void> {
  const key = `pool:${pool.slug}`;
  if (redis) {
    await redis.set(key, pool);
    return;
  }
  const store = getLocalStore();
  store[pool.slug] = pool;
  saveLocalStore(store);
}

/**
 * Delete a pool
 */
export async function deletePool(slug: string): Promise<void> {
  const key = `pool:${slug}`;
  if (redis) {
    await redis.del(key);
    return;
  }
  const store = getLocalStore();
  delete store[slug];
  saveLocalStore(store);
}

/**
 * Light rate-limiting for write operations (limit 20 requests per minute per IP)
 */
export async function checkRateLimit(
  ip: string,
  action: string = "write",
  limit = 30,
  windowSeconds = 60
): Promise<boolean> {
  const key = `ratelimit:${action}:${ip || "unknown"}`;

  if (redis) {
    try {
      const current = await redis.incr(key);
      if (current === 1) {
        await redis.expire(key, windowSeconds);
      }
      return current <= limit;
    } catch (err) {
      console.warn("Redis rate limit error, allowing:", err);
      return true;
    }
  }

  // Local memory rate limiter
  const now = Date.now();
  const entry = rateLimitMap.get(key);
  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
    return true;
  }

  entry.count += 1;
  return entry.count <= limit;
}

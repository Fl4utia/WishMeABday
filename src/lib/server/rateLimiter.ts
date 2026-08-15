// Simple in-memory rate limiter. Works across a single server instance (serverless may have multiple instances).
// For production use with multiple instances, replace with Redis or another centralized store.

type Entry = {
  timestamps: number[]; // epoch ms of request times
};

const store: Map<string, Entry> = new Map();

function now() {
  return Date.now();
}

export function getClientIdentifier(request: Request): string {
  // Prefer an authenticated user id if present
  const userId = request.headers.get("x-user-id") || request.headers.get("x-user") || undefined;
  if (userId) return `user:${userId}`;

  // Then try forwarded IP headers (Vercel / proxies)
  const xff = request.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0].trim();
    if (first) return `ip:${first}`;
  }

  const xrip = request.headers.get("x-real-ip");
  if (xrip) return `ip:${xrip}`;

  // Fallback to host header to avoid clustering everyone under the same key
  const host = request.headers.get("host") || "unknown";
  return `host:${host}`;
}

export function isRateLimited(identifier: string, limit: number, windowMs: number): { limited: boolean; remaining: number; retryAfter?: number } {
  const entry = store.get(identifier) ?? { timestamps: [] };
  const cutoff = now() - windowMs;
  // drop old timestamps
  entry.timestamps = entry.timestamps.filter((t) => t > cutoff);

  if (entry.timestamps.length >= limit) {
    const oldest = entry.timestamps[0];
    const retryAfter = Math.ceil((oldest + windowMs - now()) / 1000);
    // persist back
    store.set(identifier, entry);
    return { limited: true, remaining: 0, retryAfter };
  }

  // allow and record
  entry.timestamps.push(now());
  store.set(identifier, entry);
  return { limited: false, remaining: Math.max(0, limit - entry.timestamps.length) };
}

// Helper to check and return early as NextResponse if limited
import { NextResponse } from "next/server";

export function checkRateLimit(request: Request, limit: number, windowMs: number) {
  const identifier = getClientIdentifier(request);
  const res = isRateLimited(identifier, limit, windowMs);
  if (res.limited) {
    const body = { error: "Too many requests", details: "Rate limit exceeded" };
    const headers = new Headers();
    headers.set("Retry-After", String(res.retryAfter ?? 60));
    return NextResponse.json(body, { status: 429, headers });
  }

  return null;
}

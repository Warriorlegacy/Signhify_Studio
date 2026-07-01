import { createClient } from "@supabase/supabase-js";

interface RateLimitOptions {
  /** Max requests allowed per window. Default: 10 */
  limit?: number;
  /** Window duration in seconds. Default: 3600 (1 hour) */
  windowSeconds?: number;
  /** Unique key to namespace the limit (e.g. function name) */
  key?: string;
}

/**
 * IP-based rate limiter backed by Supabase.
 * Throws an Error when the limit is exceeded so the caller can return 429.
 */
export async function rateLimitMiddleware(
  cfConnectingIP: string | null,
  xForwardedFor: string | null,
  opts: RateLimitOptions = {},
) {
  const { limit = 10, windowSeconds = 3600, key = "default" } = opts;

  const ip =
    cfConnectingIP || (xForwardedFor ? xForwardedFor.split(",")[0].trim() : null) || "unknown";

  if (ip === "unknown") return;

  // Compute window bucket
  const now = Date.now();
  const windowStart = new Date(now - (now % (windowSeconds * 1000))).toISOString();

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) throw new Error("Missing Supabase credentials for rate limiting");

  const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

  const compositeKey = `${ip}:${key}`;

  const { data: existing, error: checkError } = await supabase
    .from("rate_limits")
    .select("count")
    .eq("ip", compositeKey)
    .eq("window_start", windowStart)
    .maybeSingle();

  if (checkError) {
    console.error("[rate-limit] Error checking rate limit:", checkError);
    return; // fail open
  }

  const count = existing?.count ?? 0;
  if (count >= limit) {
    throw new Error(`Rate limit exceeded (${limit} requests per ${windowSeconds}s). Try again later.`);
  }

  const { error: updateError } = await supabase
    .from("rate_limits")
    .upsert({ ip: compositeKey, window_start: windowStart, count: count + 1 });

  if (updateError) {
    console.error("[rate-limit] Error updating rate limit:", updateError);
  }
}

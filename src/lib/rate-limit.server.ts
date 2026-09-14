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
  if (!supabaseUrl || !serviceKey)
    throw new Error("Missing Supabase credentials for rate limiting");

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
    throw new Error(
      `Rate limit exceeded (${limit} requests per ${windowSeconds}s). Try again later.`,
    );
  }

  const { error: updateError } = await supabase
    .from("rate_limits")
    .upsert({ ip: compositeKey, window_start: windowStart, count: count + 1 });

  if (updateError) {
    console.error("[rate-limit] Error updating rate limit:", updateError);
  }
}

/**
 * IP-level verification to prevent bot/disposable email abuse of the 1 free trial.
 * Checks whether this IP has already claimed free trials.
 */
export async function checkFreeTrialIP(
  cfConnectingIP: string | null,
  xForwardedFor: string | null,
): Promise<{ allowed: boolean; reason?: string }> {
  const ip =
    cfConnectingIP || (xForwardedFor ? xForwardedFor.split(",")[0].trim() : null) || "unknown";
  if (ip === "unknown") return { allowed: true };

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) return { allowed: true };

  try {
    const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
    const { data } = await supabase
      .from("rate_limits")
      .select("count")
      .eq("ip", `trial:${ip}`)
      .maybeSingle();

    // Allow max 2 trials per IP to accommodate shared households / co-working spaces
    if (data && data.count >= 2) {
      return {
        allowed: false,
        reason:
          "The 1-time free trial has already been claimed on this network IP. Please upgrade to Studio or add your own API key in Settings → AI Keys.",
      };
    }
  } catch (e) {
    // Fail open if database lookup fails
  }
  return { allowed: true };
}

/**
 * Atomically marks the free trial as consumed for the user and records IP usage.
 */
export async function consumeFreeTrial(
  supabase: any,
  userId: string,
  clientIP?: string | null,
): Promise<{ success: boolean; message?: string }> {
  try {
    const { data, error } = await supabase.rpc("consume_free_trial", {
      p_user_id: userId,
      p_ip: clientIP || null,
    });
    if (!error && data) {
      return data;
    }
  } catch {
    /* Fallback below if stored procedure is not yet applied */
  }

  // Graceful direct-table fallback
  try {
    await supabase
      .from("profiles")
      .update({ free_trial_used: true, free_trial_claimed_at: new Date().toISOString() })
      .eq("id", userId);

    await supabase
      .from("user_credits")
      .update({ credits_remaining: 0, updated_at: new Date().toISOString() })
      .eq("user_id", userId);

    if (clientIP && clientIP !== "unknown") {
      const supabaseUrl = process.env.SUPABASE_URL;
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (supabaseUrl && serviceKey) {
        const adminClient = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
        await adminClient.from("rate_limits").upsert({
          ip: `trial:${clientIP}`,
          window_start: new Date().toISOString(),
          count: 1,
        });
      }
    }
    return { success: true, message: "Free trial consumed." };
  } catch (err) {
    console.error("[consumeFreeTrial] Error updating trial status:", err);
    return { success: false, message: "Failed to record free trial consumption." };
  }
}

/**
 * Enforces tier-specific rate limits and burst protection.
 */
export async function enforceTierRateLimit(opts: {
  cfConnectingIP: string | null;
  xForwardedFor: string | null;
  userId: string;
  tier: "free_trial" | "paid" | "byok";
  plan?: string;
}) {
  const { cfConnectingIP, xForwardedFor, userId, tier, plan } = opts;

  if (tier === "free_trial") {
    // 1 request per 30 seconds burst guard for free trial users
    await rateLimitMiddleware(cfConnectingIP, xForwardedFor, {
      limit: 1,
      windowSeconds: 30,
      key: `burst:free_trial:${userId}`,
    });
  } else if (plan === "scale") {
    // Scale tier: 30 requests per minute
    await rateLimitMiddleware(cfConnectingIP, xForwardedFor, {
      limit: 30,
      windowSeconds: 60,
      key: `burst:scale:${userId}`,
    });
  } else if (tier === "paid") {
    // Studio tier: 10 requests per minute
    await rateLimitMiddleware(cfConnectingIP, xForwardedFor, {
      limit: 10,
      windowSeconds: 60,
      key: `burst:studio:${userId}`,
    });
  } else {
    // BYOK tier: 20 requests per minute
    await rateLimitMiddleware(cfConnectingIP, xForwardedFor, {
      limit: 20,
      windowSeconds: 60,
      key: `burst:byok:${userId}`,
    });
  }
}


// ponytail: pure Stripe webhook helpers — zero imports so unit tests stay
// hermetic and the edge route bundle stays light.

export type PlanTier = "free" | "studio" | "scale";

export function priceIdToPlan(
  priceId: string | undefined | null,
  ids: { studioMonthly: string; scaleMonthly: string },
): PlanTier {
  if (!priceId) return "free";
  if (priceId === ids.studioMonthly) return "studio";
  if (priceId === ids.scaleMonthly) return "scale";
  return "free";
}

// Constant-time hex compare — edge-safe (no node:crypto), prevents timing
// probes on webhook signature verification.
export function safeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length || a.length === 0) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

// Postgres unique-violation on stripe_events.event_id → already processed.
export function isDuplicateStripeEvent(error: { code?: string } | null | undefined): boolean {
  return !!error && (error as { code?: string }).code === "23505";
}

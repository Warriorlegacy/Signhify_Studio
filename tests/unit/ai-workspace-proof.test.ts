import { describe, it } from "node:test";
import assert from "node:assert";
import {
  priceIdToPlan,
  safeEqualHex,
  isDuplicateStripeEvent,
} from "../../src/lib/stripe-webhook-helpers";
import { buildAIRunFields, aiThrottleExceeded } from "../../src/lib/ai-observability";

const IDS = { studioMonthly: "price_studio", scaleMonthly: "price_scale" };

describe("Signhify AI workspace proof", () => {
  it("maps Stripe price IDs to plans, unknown → free", () => {
    assert.strictEqual(priceIdToPlan("price_studio", IDS), "studio");
    assert.strictEqual(priceIdToPlan("price_scale", IDS), "scale");
    assert.strictEqual(priceIdToPlan("price_whatever", IDS), "free");
    assert.strictEqual(priceIdToPlan(null, IDS), "free");
  });

  it("constant-time compare accepts exact sig, rejects tampered/empty", () => {
    assert.ok(safeEqualHex("abc123", "abc123"));
    assert.ok(!safeEqualHex("abc123", "abc124"));
    assert.ok(!safeEqualHex("abc", "abcd"));
    assert.ok(!safeEqualHex("", ""));
  });

  it("treats Postgres unique-violation as duplicate Stripe delivery", () => {
    assert.ok(isDuplicateStripeEvent({ code: "23505" }));
    assert.ok(!isDuplicateStripeEvent({ code: "42P01" }));
    assert.ok(!isDuplicateStripeEvent(null));
  });

  it("labels AI runs: ok / fallback(mock) / error, clamps latency", () => {
    assert.deepStrictEqual(buildAIRunFields({ providerUsed: "Groq", latencyMs: 812 }), {
      provider_used: "Groq",
      latency_ms: 812,
      status: "ok",
      error: null,
    });
    const mock = buildAIRunFields({ providerUsed: "mock", latencyMs: 3 });
    assert.strictEqual(mock.status, "fallback");
    const err = buildAIRunFields({
      providerUsed: "Groq",
      latencyMs: -5,
      error: new Error("boom"),
    });
    assert.strictEqual(err.status, "error");
    assert.strictEqual(err.latency_ms, 0);
    assert.match(err.error ?? "", /boom/);
  });

  it("throttles runaway per-user AI loops at 10 plans/min", () => {
    assert.ok(!aiThrottleExceeded(9));
    assert.ok(aiThrottleExceeded(10));
    assert.ok(aiThrottleExceeded(99));
  });
});

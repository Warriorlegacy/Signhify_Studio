import { describe, expect, it } from "bun:test";
import { resolveAIAccess, FreeTrialExpiredError, BYOKRequiredError } from "@/lib/ai-access.server";

describe("Free Trial & Tier-Based Access Control", () => {
  it("grants managed paid access to admin emails", async () => {
    const mockSupabase = {
      from: () => ({
        select: () => ({
          eq: () => ({
            maybeSingle: async () => ({ data: { subscription_plan: "free", subscription_status: "active", free_trial_used: true } }),
          }),
        }),
      }),
    };

    const access = await resolveAIAccess({
      supabase: mockSupabase as any,
      userId: "user-admin-1",
      email: "piyushrajsingh092@gmail.com",
    });

    expect(access.mode).toBe("managed");
    expect((access as any).tier).toBe("paid");
  });

  it("grants managed paid access to Studio/Scale/Pro paid subscribers", async () => {
    const mockSupabase = {
      from: () => ({
        select: () => ({
          eq: () => ({
            maybeSingle: async () => ({ data: { subscription_plan: "studio", subscription_status: "active", free_trial_used: true } }),
          }),
        }),
      }),
    };

    const access = await resolveAIAccess({
      supabase: mockSupabase as any,
      userId: "user-paid-1",
      email: "subscriber@example.com",
    });

    expect(access.mode).toBe("managed");
    expect((access as any).tier).toBe("paid");
  });

  it("grants 1 free trial on managed free coding cluster to new free accounts", async () => {
    const mockSupabase = {
      from: () => ({
        select: () => ({
          eq: () => ({
            maybeSingle: async () => ({ data: { subscription_plan: "free", subscription_status: "active", free_trial_used: false } }),
          }),
        }),
      }),
    };

    const access = await resolveAIAccess({
      supabase: mockSupabase as any,
      userId: "user-free-new-1",
      email: "newuser@example.com",
    });

    expect(access.mode).toBe("managed");
    expect((access as any).tier).toBe("free_trial");
  });

  it("rejects free users with FreeTrialExpiredError once the free trial is used and no BYOK keys are configured", async () => {
    const mockSupabase = {
      from: (table: string) => {
        if (table === "profiles") {
          return {
            select: () => ({
              eq: () => ({
                maybeSingle: async () => ({
                  data: { subscription_plan: "free", subscription_status: "active", free_trial_used: true },
                }),
              }),
            }),
          };
        }
        if (table === "user_ai_keys") {
          return {
            select: async () => ({ data: [] }),
          };
        }
        return {};
      },
    };

    expect(
      resolveAIAccess({
        supabase: mockSupabase as any,
        userId: "user-free-exhausted-1",
        email: "spentuser@example.com",
      }),
    ).rejects.toThrow(FreeTrialExpiredError);
  });

  it("FreeTrialExpiredError has code FREE_TRIAL_EXPIRED and actionable guidance", () => {
    const err = new FreeTrialExpiredError();
    expect(err.code).toBe("FREE_TRIAL_EXPIRED");
    expect(err.message).toContain("1 free trial");
    expect(err.message).toContain("/pricing");
  });
});

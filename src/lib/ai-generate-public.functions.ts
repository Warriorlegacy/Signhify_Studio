import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";
import { generateAIResponse } from "./ai-gateway.server";
import type { GeneratedPlan } from "./ai-generate.functions";

/**
 * Public (signed-out) blueprint generation.
 *
 * Visitors get ONE real AI-generated plan, then must sign in. The quota is
 * tracked per network IP in the existing `rate_limits` table under the
 * `anonplan:` namespace, so it survives page reloads and private windows.
 * Only free provider clusters are used — no user-supplied keys are involved.
 */

const SYSTEM = `You are Signhify AI, a six-agent product studio (Product Strategist, System Architect, UI/UX Designer, Frontend Engineer, Backend Engineer, Deployment).
Given a single product idea, return a concise build plan as STRICT JSON matching this TypeScript type:
{ "productName": string, "oneLiner": string, "sections": { "title": string, "bullets": string[] }[], "stack": string[] }
- 6 sections, one per agent, in the order listed above.
- 3 to 5 bullets per section, each <= 140 characters, no markdown.
- "stack" is a flat list of 5-8 technologies.
- Output ONLY the JSON object. No prose, no code fences.`;

export class SignInRequiredError extends Error {
  code = "SIGN_IN_REQUIRED";
  constructor() {
    super("You have used your free blueprint. Sign in to keep generating plans.");
    this.name = "SignInRequiredError";
  }
}

const FREE_ANON_PLANS = 1;

function clientIp(): string {
  const request = getRequest();
  const h = request?.headers;
  const ip =
    h?.get("cf-connecting-ip") ||
    h?.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h?.get("x-real-ip") ||
    "";
  return ip || "unknown";
}

function adminClient() {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_SERVICE_ROLE_KEY"];
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

/** Reports whether the visitor still has their free blueprint available. */
export const getPublicPlanQuota = createServerFn({ method: "GET" }).handler(async () => {
  const ip = clientIp();
  const supabase = adminClient();
  if (ip === "unknown" || !supabase) return { remaining: FREE_ANON_PLANS };
  const { data } = await supabase
    .from("rate_limits")
    .select("count")
    .eq("ip", `anonplan:${ip}`)
    .maybeSingle();
  const used = (data as { count?: number } | null)?.count ?? 0;
  return { remaining: Math.max(0, FREE_ANON_PLANS - used) };
});

export const generatePublicPlan = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const prompt = typeof (input as { prompt?: unknown })?.prompt === "string"
      ? (input as { prompt: string }).prompt.trim()
      : "";
    if (prompt.length < 4 || prompt.length > 1200) {
      throw new Error("Prompt must be between 4 and 1200 characters.");
    }
    return { prompt };
  })
  .handler(async ({ data }): Promise<GeneratedPlan> => {
    const ip = clientIp();
    const supabase = adminClient();
    const quotaKey = `anonplan:${ip}`;
    let used = 0;

    if (supabase && ip !== "unknown") {
      const { data: row } = await supabase
        .from("rate_limits")
        .select("count")
        .eq("ip", quotaKey)
        .maybeSingle();
      used = (row as { count?: number } | null)?.count ?? 0;
      if (used >= FREE_ANON_PLANS) throw new SignInRequiredError();
    }

    const started = Date.now();
    const { content, providerUsed } = await (async () => {
      const { robustAIService } = await import("./robust-ai-service");
      return robustAIService.generateAIResponse({
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: data.prompt },
        ],
        temperature: 0.6,
        response_format: { type: "json_object" },
        tier: "free_trial",
        preferredCluster: "free_coding",
      });
    })();

    let parsed: GeneratedPlan;
    try {
      parsed = JSON.parse(content) as GeneratedPlan;
    } catch {
      throw new Error("The AI returned an unreadable plan. Please try again.");
    }
    if (
      !parsed?.productName ||
      !parsed?.oneLiner ||
      !Array.isArray(parsed?.sections) ||
      !Array.isArray(parsed?.stack)
    ) {
      throw new Error("The AI returned an incomplete plan. Please try again.");
    }

    parsed.providerUsed = providerUsed;
    parsed.latencyMs = Date.now() - started;

    if (supabase && ip !== "unknown") {
      await supabase
        .from("rate_limits")
        .upsert({ ip: quotaKey, window_start: new Date(0).toISOString(), count: used + 1 });
    }

    return parsed;
  });

// Keep a reference so tree-shaking never drops the managed helper import.
export type { GeneratedPlan };
void generateAIResponse;

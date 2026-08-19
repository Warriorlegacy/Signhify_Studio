import type { SupabaseClient } from "@supabase/supabase-js";
import { isAdminEmail } from "./admin";

// Paid plans that keep managed Signhify AI access. Free users must BYOK.
const PAID_PLANS = new Set(["studio", "scale", "pro"]);

// Provider names accepted for BYOK. Must match names in robust-ai-service.
export const BYOK_PROVIDERS = [
  "OpenAI",
  "ChatGPT_Cookies",
  "Gemini",
  "Gemini_Cookies",
  "Groq",
  "Cerebras",
  "NVIDIA",
  "OpenRouter",
  "Ollama",
  "Mistral",
  "Cohere",
  "xAI",
  "Anthropic",
  "Custom",
] as const;
export type BYOKProvider = (typeof BYOK_PROVIDERS)[number];

export type AIAccess =
  | { mode: "managed" }
  | { mode: "byok"; userKeys: Record<string, string>; customEndpoints: Record<string, string> };

export class BYOKRequiredError extends Error {
  code = "BYOK_REQUIRED";
  constructor() {
    super(
      "Signhify AI is available on paid plans. Free users must add their own API key in Settings → AI Keys, or upgrade at /pricing.",
    );
    this.name = "BYOKRequiredError";
  }
}

export type AICtx = {
  supabase: SupabaseClient;
  userId: string;
  email?: string | null;
  /** Browser-held client keys (per provider) sent per-request via withByokKeys middleware. */
  byokClientKeys?: Record<string, string>;
};

export async function resolveAIAccess(ctx: AICtx): Promise<AIAccess> {
  // Admins always use managed keys.
  if (isAdminEmail(ctx.email)) return { mode: "managed" };

  const { data: prof } = await (ctx.supabase as any)
    .from("profiles")
    .select("subscription_plan, subscription_status")
    .eq("id", ctx.userId)
    .maybeSingle();

  const plan = String(prof?.subscription_plan ?? "free").toLowerCase();
  const status = String(prof?.subscription_status ?? "").toLowerCase();
  const paid =
    PAID_PLANS.has(plan) && (status === "" || status === "active" || status === "trialing");
  if (paid) return { mode: "managed" };

  // Free plan → require BYOK. Read keys through the user-scoped client (RLS).
  const { data: keys } = await (ctx.supabase as any)
    .from("user_ai_keys")
    .select("provider, api_key_encrypted, api_endpoint");

  const { decryptAES256GCM } = await import("./secrets.server");
  const { default: logger } = await import("./logger");

  const masterKey = process.env.SECRETS_MASTER_KEY;
  const clientKeys = ctx.byokClientKeys ?? {};
  const userKeys: Record<string, string> = {};
  const customEndpoints: Record<string, string> = {};
  let decryptFailures = 0;
  for (const k of (keys ?? []) as Array<{
    provider: string;
    api_key_encrypted: string;
    api_endpoint?: string;
  }>) {
    if (!k?.api_key_encrypted) continue;
    // Try the browser-held client key first (new scheme), then the legacy
    // server master key for rows saved before BYOK moved client-side.
    const attempts = [
      ...(clientKeys[k.provider] ? [clientKeys[k.provider]] : []),
      ...(masterKey && masterKey.length >= 16 ? [masterKey] : []),
    ];
    let decrypted: string | null = null;
    for (const attempt of attempts) {
      try {
        decrypted = decryptAES256GCM(k.api_key_encrypted, attempt);
        break;
      } catch {
        /* try next */
      }
    }
    if (decrypted === null) {
      decryptFailures += 1;
      // Never log key material — only provider + userId.
      logger.warn({
        event: "byok.decrypt_failed",
        kind: "byok_audit",
        userId: ctx.userId,
        provider: k.provider,
      });
      continue;
    }
    userKeys[k.provider] = decrypted;
    if (k.provider === "Custom" && k.api_endpoint) {
      customEndpoints[k.provider] = k.api_endpoint;
    }
    logger.debug({
      event: "byok.decrypt_ok",
      kind: "byok_audit",
      userId: ctx.userId,
      provider: k.provider,
    });
  }
  if (Object.keys(userKeys).length === 0) {
    if (decryptFailures > 0) {
      const error = new Error(
        "Your saved AI keys could not be decrypted. Please re-enter them in Settings → AI Keys.",
      );
      (error as { code?: string }).code = "BYOK_DECRYPT_FAILED";
      throw error;
    }
    throw new BYOKRequiredError();
  }
  return { mode: "byok", userKeys, customEndpoints };
}

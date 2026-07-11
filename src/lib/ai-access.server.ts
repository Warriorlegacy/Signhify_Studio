import type { SupabaseClient } from "@supabase/supabase-js";
import { isAdminEmail } from "./admin";

// Paid plans that keep managed Signhify AI access. Free users must BYOK.
const PAID_PLANS = new Set(["studio", "scale", "pro"]);

// Provider names accepted for BYOK. Must match names in robust-ai-service.
export const BYOK_PROVIDERS = [
  "Groq",
  "Cerebras",
  "NVIDIA",
  "OpenRouter",
  "Gemini",
  "Ollama",
  "Mistral",
  "Cohere",
  "xAI",
  "Anthropic",
] as const;
export type BYOKProvider = (typeof BYOK_PROVIDERS)[number];

export type AIAccess =
  | { mode: "managed" }
  | { mode: "byok"; userKeys: Record<string, string> };

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
    PAID_PLANS.has(plan) &&
    (status === "" || status === "active" || status === "trialing");
  if (paid) return { mode: "managed" };

  // Free plan → require BYOK. Read keys through the user-scoped client (RLS).
  const { data: keys } = await (ctx.supabase as any)
    .from("user_ai_keys")
    .select("provider, api_key_encrypted");

  const masterKey = process.env.SECRETS_MASTER_KEY;
  if (!masterKey) throw new Error("Missing SECRETS_MASTER_KEY.");
  const { decryptAES256GCM } = await import("./secrets.server");

  const userKeys: Record<string, string> = {};
  for (const k of (keys ?? []) as Array<{ provider: string; api_key_encrypted: string }>) {
    if (k?.api_key_encrypted) {
      try {
        userKeys[k.provider] = decryptAES256GCM(k.api_key_encrypted, masterKey);
      } catch {
        // Skip malformed/undecryptable entries.
      }
    }
  }
  if (Object.keys(userKeys).length === 0) throw new BYOKRequiredError();
  return { mode: "byok", userKeys };
}

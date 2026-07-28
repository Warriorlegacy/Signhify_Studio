import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { BYOK_PROVIDERS, type BYOKProvider } from "./ai-access.server";
import logger from "./logger";

function assertProvider(p: unknown): BYOKProvider {
  if (typeof p !== "string" || !(BYOK_PROVIDERS as readonly string[]).includes(p)) {
    throw new Error("Unsupported provider.");
  }
  return p as BYOKProvider;
}

const AES_GCM_CIPHERTEXT_RE = /^[0-9a-f]{24}:[0-9a-f]{32}:[0-9a-f]+$/i;

/**
 * Reject obvious garbage or accidental plaintext-encrypted-looking values.
 * Providers use various formats, so we only enforce coarse safety rules:
 *  - printable ASCII only (no NUL, no control chars)
 *  - no whitespace inside
 *  - not shaped like our own AES-GCM ciphertext (a paste-back accident)
 *  - contains at least one letter and one digit or symbol (avoids pure prose)
 */
function validateApiKeyShape(apiKey: string): void {
  if (!/^[\x21-\x7e]+$/.test(apiKey)) {
    throw new Error("API key contains invalid characters (whitespace or non-printable).");
  }
  if (AES_GCM_CIPHERTEXT_RE.test(apiKey)) {
    throw new Error("This value looks like an encrypted blob, not a raw API key.");
  }
  const hasLetter = /[A-Za-z]/.test(apiKey);
  const hasOther = /[0-9._\-\/+=~]/.test(apiKey);
  if (!hasLetter || !hasOther) {
    throw new Error("API key does not look like a valid provider key.");
  }
}

function auditLog(event: string, fields: Record<string, unknown>): void {
  // Never include api_key material. Provider name + userId is enough for audit.
  try {
    logger.info({ event, kind: "byok_audit", ...fields });
  } catch {
    /* logger must never throw here */
  }
}

function assertMasterKey(): string {
  const masterKey = process.env.SECRETS_MASTER_KEY;
  if (!masterKey || masterKey.length < 16) {
    logger.error({ event: "byok.master_key_missing", kind: "byok_audit" });
    throw new Error(
      "Server encryption key is not configured. Please contact support — your key was not saved.",
    );
  }
  return masterKey;
}

export const listMyAiKeys = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await (supabase as any)
      .from("user_ai_keys")
      .select("provider, updated_at")
      .eq("user_id", userId);
    if (error) throw new Error(error.message);
    // Never return the api_key itself. Only surface which providers are set.
    return {
      providers: BYOK_PROVIDERS.map((name) => {
        const row = (data ?? []).find((r: { provider: string }) => r.provider === name);
        return {
          provider: name,
          configured: !!row,
          updatedAt: row?.updated_at ?? null,
        };
      }),
    };
  });

export const saveMyAiKey = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    const obj = (input ?? {}) as Record<string, unknown>;
    const provider = assertProvider(obj.provider);
    const apiKey = typeof obj.apiKey === "string" ? obj.apiKey.trim() : "";
    const apiEndpoint =
      obj.provider === "Custom" && typeof obj.apiEndpoint === "string"
        ? obj.apiEndpoint.trim()
        : "";
    if (apiKey.length < 10 || apiKey.length > 400) {
      throw new Error("API key must be between 10 and 400 characters.");
    }
    if (provider === "Custom" && apiEndpoint) {
      try {
        new URL(apiEndpoint);
      } catch {
        throw new Error(
          "Custom endpoint must be a valid URL (e.g. https://my-model.example.com/v1).",
        );
      }
    }
    validateApiKeyShape(apiKey);
    return { provider, apiKey, apiEndpoint };
  })
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const masterKey = assertMasterKey();
    const { encryptAES256GCM } = await import("./secrets.server");
    let encrypted: string;
    try {
      encrypted = encryptAES256GCM(data.apiKey, masterKey);
    } catch (err) {
      auditLog("byok.encrypt_failed", { userId, provider: data.provider });
      throw new Error("Failed to encrypt key. Your key was not saved.");
    }
    const record: Record<string, unknown> = {
      user_id: userId,
      provider: data.provider,
      api_key_encrypted: encrypted,
      updated_at: new Date().toISOString(),
    };
    if (data.apiEndpoint) record.api_endpoint = data.apiEndpoint;
    const { error } = await (supabase as any)
      .from("user_ai_keys")
      .upsert(record, { onConflict: "user_id,provider" });
    if (error) {
      auditLog("byok.save_failed", { userId, provider: data.provider });
      throw new Error(error.message);
    }
    auditLog("byok.saved", { userId, provider: data.provider });
    return { ok: true };
  });

export const deleteMyAiKey = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    const obj = (input ?? {}) as Record<string, unknown>;
    return { provider: assertProvider(obj.provider) };
  })
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const { error } = await (supabase as any)
      .from("user_ai_keys")
      .delete()
      .eq("user_id", userId)
      .eq("provider", data.provider);
    if (error) {
      auditLog("byok.delete_failed", { userId, provider: data.provider });
      throw new Error(error.message);
    }
    auditLog("byok.deleted", { userId, provider: data.provider });
    return { ok: true };
  });

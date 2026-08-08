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
 * Normalizes raw session tokens, cookie headers, and API keys.
 * Handles:
 * - __Secure-next-auth.session-token=eyJ...; other=... -> extracts session-token
 * - __Secure-1PSID=...; other=... -> extracts 1PSID
 * - JSON { "accessToken": "eyJ..." } -> extracts accessToken
 * - Bearer tokens -> strips "Bearer " prefix
 * - Quoted strings -> strips surrounding quotes
 */
export function normalizeSessionTokenOrKey(provider: string, input: string): string {
  let cleaned = input.trim();
  // Strip outer quotes if pasted with quotes
  if (
    (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
    (cleaned.startsWith("'") && cleaned.endsWith("'"))
  ) {
    cleaned = cleaned.slice(1, -1).trim();
  }

  if (provider === "ChatGPT_Cookies") {
    // If user passed a full Cookie header: e.g. "__Secure-next-auth.session-token=eyJ...; other=..."
    const match = cleaned.match(/__Secure-next-auth\.session-token=([^;\s]+)/i);
    if (match && match[1]) {
      cleaned = match[1].trim();
    } else if (cleaned.includes("accessToken")) {
      try {
        const parsed = JSON.parse(cleaned);
        if (parsed.accessToken) cleaned = String(parsed.accessToken).trim();
        else if (parsed.token) cleaned = String(parsed.token).trim();
      } catch {
        const jsonMatch = cleaned.match(/"accessToken"\s*:\s*"([^"]+)"/i);
        if (jsonMatch && jsonMatch[1]) cleaned = jsonMatch[1].trim();
      }
    } else if (cleaned.startsWith("Bearer ")) {
      cleaned = cleaned.slice(7).trim();
    }
  } else if (provider === "Gemini_Cookies") {
    const match = cleaned.match(/__Secure-1PSID=([^;\s]+)/i);
    if (match && match[1]) {
      cleaned = match[1].trim();
    }
  } else if (provider === "OpenAI") {
    if (cleaned.startsWith("Bearer ")) {
      cleaned = cleaned.slice(7).trim();
    }
  }
  return cleaned;
}

/**
 * Validates token / key shape for BYOK and Session Login:
 *  - no unprintable control characters or NULs
 *  - not shaped like our internal AES-GCM ciphertext
 *  - length between 8 and 8192 characters (supports long JWTs and cookie payloads)
 *  - contains letters and digits/symbols
 */
export function validateApiKeyShape(provider: string, apiKey: string): void {
  if (/[\x00-\x08\x0E-\x1F\x7F]/.test(apiKey)) {
    throw new Error("Token or API key contains invalid control characters.");
  }
  if (AES_GCM_CIPHERTEXT_RE.test(apiKey)) {
    throw new Error("This value looks like an encrypted blob, not a raw token or API key.");
  }
  if (apiKey.length < 8) {
    throw new Error("Token or API key is too short (minimum 8 characters).");
  }
  if (apiKey.length > 8192) {
    throw new Error("Token exceeds maximum supported size (8,192 characters).");
  }
  const hasLetter = /[A-Za-z]/.test(apiKey);
  const hasOther = /[0-9._\-\/+=~:;%]/.test(apiKey);
  if (!hasLetter || !hasOther) {
    throw new Error("Value does not look like a valid token or API key.");
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
    const rawApiKey = typeof obj.apiKey === "string" ? obj.apiKey.trim() : "";
    const apiEndpoint =
      obj.provider === "Custom" && typeof obj.apiEndpoint === "string"
        ? obj.apiEndpoint.trim()
        : "";
    if (rawApiKey.length < 8 || rawApiKey.length > 8192) {
      throw new Error("Token or API key must be between 8 and 8,192 characters.");
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
    const apiKey = normalizeSessionTokenOrKey(provider, rawApiKey);
    validateApiKeyShape(provider, apiKey);
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
    return { ok: true, provider: data.provider };
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

export const testMyAiConnection = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    const obj = (input ?? {}) as Record<string, unknown>;
    return { provider: assertProvider(obj.provider) };
  })
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const masterKey = assertMasterKey();
    const { decryptAES256GCM } = await import("./secrets.server");
    const { data: row, error } = await (supabase as any)
      .from("user_ai_keys")
      .select("provider, api_key_encrypted, api_endpoint")
      .eq("user_id", userId)
      .eq("provider", data.provider)
      .maybeSingle();
    if (error || !row?.api_key_encrypted) {
      throw new Error(`No credentials saved for ${data.provider}.`);
    }
    let decryptedKey: string;
    try {
      decryptedKey = decryptAES256GCM(row.api_key_encrypted, masterKey);
    } catch {
      throw new Error("Failed to decrypt credentials. Please re-save your token or key.");
    }

    const startTime = Date.now();
    try {
      const { robustAIService } = await import("./robust-ai-service");
      const result = await robustAIService.testProviderCredentials(
        data.provider,
        decryptedKey,
        row.api_endpoint,
      );
      const latencyMs = Date.now() - startTime;
      return {
        ok: true,
        latencyMs,
        provider: data.provider,
        message: result.message || "Connection verified successfully!",
      };
    } catch (err: any) {
      const latencyMs = Date.now() - startTime;
      return {
        ok: false,
        latencyMs,
        provider: data.provider,
        message: err?.message || "Connection verification failed.",
      };
    }
  });

import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { BYOK_PROVIDERS, type BYOKProvider } from "./ai-access.server";
import { withByokKeys } from "./byok-middleware";
import { AES_GCM_CIPHERTEXT_RE } from "./byok-client";
import logger from "./logger";

function assertProvider(p: unknown): BYOKProvider {
  if (typeof p !== "string" || !(BYOK_PROVIDERS as readonly string[]).includes(p)) {
    throw new Error("Unsupported provider.");
  }
  return p as BYOKProvider;
}

function auditLog(event: string, fields: Record<string, unknown>): void {
  // Never include api_key material. Provider name + userId is enough for audit.
  try {
    logger.info({ event, kind: "byok_audit", ...fields });
  } catch {
    /* logger must never throw here */
  }
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
    // Client-encrypted blob only — the raw key never leaves the browser.
    const apiKeyEncrypted =
      typeof obj.apiKeyEncrypted === "string" ? obj.apiKeyEncrypted.trim() : "";
    if (!AES_GCM_CIPHERTEXT_RE.test(apiKeyEncrypted) || apiKeyEncrypted.length > 20000) {
      throw new Error("Invalid encrypted key payload.");
    }
    const apiEndpoint =
      obj.provider === "Custom" && typeof obj.apiEndpoint === "string"
        ? obj.apiEndpoint.trim()
        : "";
    if (provider === "Custom" && apiEndpoint) {
      try {
        new URL(apiEndpoint);
      } catch {
        throw new Error(
          "Custom endpoint must be a valid URL (e.g. https://my-model.example.com/v1).",
        );
      }
    }
    return { provider, apiKeyEncrypted, apiEndpoint };
  })
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const record: Record<string, unknown> = {
      user_id: userId,
      provider: data.provider,
      api_key_encrypted: data.apiKeyEncrypted,
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
  .middleware([requireSupabaseAuth, withByokKeys])
  .inputValidator((input: unknown) => {
    const obj = (input ?? {}) as Record<string, unknown>;
    return { provider: assertProvider(obj.provider) };
  })
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
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
    const masterKey = process.env.SECRETS_MASTER_KEY;
    const clientKey = (context as { byokClientKeys?: Record<string, string> }).byokClientKeys?.[
      data.provider
    ];
    const attempts = [clientKey, masterKey].filter(
      (k): k is string => typeof k === "string" && k.length >= 16,
    );
    let decryptedKey: string | null = null;
    for (const attempt of attempts) {
      try {
        decryptedKey = decryptAES256GCM(row.api_key_encrypted, attempt);
        break;
      } catch {
        /* try next */
      }
    }
    if (!decryptedKey) {
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

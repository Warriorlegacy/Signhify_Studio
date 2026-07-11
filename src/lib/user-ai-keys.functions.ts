import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { BYOK_PROVIDERS, type BYOKProvider } from "./ai-access.server";

function assertProvider(p: unknown): BYOKProvider {
  if (typeof p !== "string" || !(BYOK_PROVIDERS as readonly string[]).includes(p)) {
    throw new Error("Unsupported provider.");
  }
  return p as BYOKProvider;
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
    if (apiKey.length < 10 || apiKey.length > 400) {
      throw new Error("API key must be between 10 and 400 characters.");
    }
    return { provider, apiKey };
  })
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const masterKey = process.env.SECRETS_MASTER_KEY;
    if (!masterKey) throw new Error("Missing SECRETS_MASTER_KEY.");
    const { encryptAES256GCM } = await import("./secrets.server");
    const { error } = await (supabase as any)
      .from("user_ai_keys")
      .upsert(
        {
          user_id: userId,
          provider: data.provider,
          api_key_encrypted: encryptAES256GCM(data.apiKey, masterKey),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,provider" },
      );
    if (error) throw new Error(error.message);
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
    if (error) throw new Error(error.message);
    return { ok: true };
  });

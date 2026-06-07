import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const listSecretKeys = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((i: unknown) => ({ projectId: String((i as any)?.projectId ?? "") })).handler(async ({ data, context }) => {
  const { supabase, userId } = context as any;
  const { data: rows, error } = await supabase.from("project_secrets").select("id,key,created_at").eq("project_id", data.projectId).eq("user_id", userId).order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return { secrets: rows ?? [] };
});
export const createSecret = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((i: unknown) => ({ projectId: String((i as any)?.projectId ?? ""), key: String((i as any)?.key ?? "").trim(), value: String((i as any)?.value ?? "") })).handler(async ({ data, context }) => {
  if (!data.key || !data.value) throw new Error("Key and value are required.");
  const masterKey = process.env.SECRETS_MASTER_KEY;
  if (!masterKey) throw new Error("Missing SECRETS_MASTER_KEY.");
  const { encryptAES256GCM } = await import("./secrets.server");
  const { supabase, userId } = context as any;
  const { error } = await supabase.from("project_secrets").insert({ project_id: data.projectId, user_id: userId, key: data.key, encrypted_value: encryptAES256GCM(data.value, masterKey) });
  if (error) throw new Error(error.message);
  return { ok: true };
});
export const deleteSecret = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((i: unknown) => ({ secretId: String((i as any)?.secretId ?? ""), projectId: String((i as any)?.projectId ?? "") })).handler(async ({ data, context }) => {
  const { supabase, userId } = context as any;
  const { error } = await supabase.from("project_secrets").delete().eq("id", data.secretId).eq("project_id", data.projectId).eq("user_id", userId);
  if (error) throw new Error(error.message);
  return { ok: true };
});

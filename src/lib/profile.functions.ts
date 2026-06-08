import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const softDeleteProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context as any;
    await supabase.from("profiles").upsert({ id: userId, deleted_at: new Date().toISOString() });
    return { ok: true };
  });

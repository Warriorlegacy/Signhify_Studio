import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { resolveAIAccess } from "./ai-access.server";
import { withByokKeys } from "./byok-middleware";

export const getGeneratePlanStreamConfig = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth, withByokKeys])
  .handler(async ({ context }) => {
    const { supabase, userId, claims } = context as {
      supabase: any;
      userId: string;
      claims?: { email?: string | null };
    };
    const byokClientKeys = (context as { byokClientKeys?: Record<string, string> }).byokClientKeys;
    // Gate the streaming path with the same BYOK check as the non-stream one.
    // Throws BYOKRequiredError for free users without any key configured.
    await resolveAIAccess({ supabase, userId, email: claims?.email ?? null, byokClientKeys });

    const base = process.env.SUPABASE_URL;
    const bearer = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;
    if (!base || !bearer) throw new Error("Missing Supabase Edge Function configuration.");
    return { url: `${base.replace(/\/$/, "")}/functions/v1/generate-plan`, bearer };
  });

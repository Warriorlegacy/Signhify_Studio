import { createServerFn } from "@tanstack/react-start";

export const initFreeCredits = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const { userId } = input as { userId: string };
    if (!userId || typeof userId !== "string") throw new Error("userId required");
    return { userId };
  })
  .handler(async ({ data }) => {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) throw new Error("Server not configured for credit init");

    // ponytail: raw pg query to bypass incomplete types
    const { createClient } = await import("@supabase/supabase-js");
    const sb = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { error } = await sb.rpc(
      "add_credits" as any,
      {
        p_user_id: data.userId,
        p_amount: 2,
      } as any,
    );

    if (error) {
      console.error("[initFreeCredits] rpc failed", error);
      const { error: insertError } = await (sb.from("user_credits") as any).upsert(
        {
          user_id: data.userId,
          tier: "free",
          credits_remaining: 2,
          max_credits: 2,
        },
        { onConflict: "user_id" },
      );
      if (insertError) throw new Error("Failed to init credits");
    }
    return { ok: true };
  });

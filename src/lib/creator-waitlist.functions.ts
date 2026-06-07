import { createServerFn } from "@tanstack/react-start";

export const joinCreatorWaitlist = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const email = String((input as any)?.email ?? "").trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Enter a valid email.");
    return { email };
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await (supabaseAdmin.from as any)("creator_waitlist").insert({ email: data.email });
    if (error && error.code !== "23505") throw new Error("Could not join creator waitlist.");
    return { ok: true };
  });

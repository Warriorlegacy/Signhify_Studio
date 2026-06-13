import { createServerFn } from "@tanstack/react-start";

export const joinCreatorWaitlist = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const email = String((input as any)?.email ?? "")
      .trim()
      .toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Enter a valid email.");
    return { email };
  })
  .handler(async ({ data }) => {
    const { supabase } = await import("@/integrations/supabase/client");
    const { error } = await supabase
      .from("creator_waitlist")
      .insert({
        email: data.email,
      });

    // Ignore duplicate entry error (code 23505) as it's okay if user already exists
    if (error && error.code !== "23505") throw new Error("Could not join creator waitlist.");
    return { ok: true };
  });

import { createServerFn } from "@tanstack/react-start";

type WaitlistInput = { email: string; prompt?: string; source?: string };

function validate(input: unknown): WaitlistInput {
  const obj = input as Record<string, unknown>;
  const email = typeof obj?.email === "string" ? obj.email.trim() : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 320) {
    throw new Error("Enter a valid email.");
  }
  const prompt = typeof obj?.prompt === "string" ? obj.prompt.trim().slice(0, 2000) : undefined;
  const source = typeof obj?.source === "string" ? obj.source.trim().slice(0, 64) : "ai-page";
  return { email, prompt, source };
}

export const joinWaitlist = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => validate(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("waitlist").insert({
      email: data.email,
      prompt: data.prompt ?? null,
      source: data.source ?? "ai-page",
    });
    if (error) {
      console.error("[waitlist] insert failed", error);
      throw new Error("Could not join the list. Try again or email hello@signhify.online.");
    }

    const edgeBase = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (edgeBase && serviceKey) {
      await fetch(`${edgeBase.replace(/\/$/, "")}/functions/v1/send-waitlist-email`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${serviceKey}`,
        },
        body: JSON.stringify({
          email: data.email,
          prompt_preview: data.prompt?.slice(0, 180) ?? "",
        }),
      }).catch((mailError) => console.error("[waitlist] email failed", mailError));
    }
    return { ok: true as const };
  });

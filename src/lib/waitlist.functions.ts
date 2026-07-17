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
      throw new Error("Could not join the list. Try again or email Piyushrajsingh092@gmail.com.");
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

// Deterministic token generation matching deno edge function
async function tokenFor(email: string): Promise<string> {
  const data = new TextEncoder().encode(email.toLowerCase().trim());
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const confirmWaitlistToken = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const token = (input as Record<string, unknown>)?.token;
    if (typeof token !== "string" || !token.trim()) {
      throw new Error("Verification token is required.");
    }
    return { token: token.trim() };
  })
  .handler(async ({ data }): Promise<{ email: string }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Fetch all unconfirmed waitlist entries
    const { data: entries, error: fetchError } = await supabaseAdmin
      .from("waitlist")
      .select("id, email")
      .eq("confirmed", false);

    if (fetchError) {
      console.error("[confirmWaitlistToken] fetch failed", fetchError);
      throw new Error("Verification failed. Please try again.");
    }

    if (!entries || entries.length === 0) {
      throw new Error("Invalid or expired verification link.");
    }

    // Find the entry that matches the SHA-256 token
    let matchEntry: { id: string; email: string } | null = null;
    for (const entry of entries) {
      const generatedToken = await tokenFor(entry.email);
      if (generatedToken === data.token) {
        matchEntry = entry;
        break;
      }
    }

    if (!matchEntry) {
      throw new Error("Invalid or expired verification link.");
    }

    // Update confirmed status
    const { error: updateError } = await supabaseAdmin
      .from("waitlist")
      .update({
        confirmed: true,
        confirmed_at: new Date().toISOString(),
      })
      .eq("id", matchEntry.id);

    if (updateError) {
      console.error("[confirmWaitlistToken] update failed", updateError);
      throw new Error("Could not confirm your access. Try again.");
    }

    return { email: matchEntry.email };
  });


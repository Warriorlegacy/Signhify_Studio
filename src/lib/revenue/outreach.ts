import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type OutreachEventType = "sent" | "open" | "click" | "reply" | "bounce";

function toSupabase(env: "dev" | "prod" = "prod"): string {
  const url = process.env.SUPABASE_URL;
  if (!url) throw new Error("Missing SUPABASE_URL");
  const key =
    env === "prod"
      ? process.env.SUPABASE_SECRET_KEY
      : process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!key) throw new Error(`Missing SUPABASE_${env === "prod" ? "SECRET" : "PUBLISHABLE"}_KEY`);
  return `${url.replace(/\/$/, "")}/functions/v1`;
}

async function callEdgeFunction(name: string, body: Record<string, unknown>) {
  const base = toSupabase("prod");
  const serviceKey = process.env.SUPABASE_SECRET_KEY;
  if (!serviceKey) throw new Error("Missing SUPABASE_SECRET_KEY");

  const res = await fetch(`${base}/${name}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${serviceKey}`,
    },
    body: JSON.stringify(body),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = typeof json?.error === "string" ? json.error : `Edge function ${name} failed`;
    throw new Error(msg);
  }
  return json;
}

export const sendOutreachEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const obj = input as Record<string, unknown>;
    const to = typeof obj?.to === "string" ? obj.to.trim() : "";
    const subject = typeof obj?.subject === "string" ? obj.subject.trim() : "";
    const html = typeof obj?.html === "string" ? obj.html.trim() : "";
    const replyTo = typeof obj?.replyTo === "string" ? obj.replyTo.trim() : undefined;
    const sendId = typeof obj?.sendId === "string" ? obj.sendId : undefined;
    if (!to) throw new Error("Recipient email is required");
    if (!subject) throw new Error("Subject is required");
    if (!html) throw new Error("HTML body is required");
    if (!to.includes("@")) throw new Error("Invalid recipient email");
    return { to, subject, html, replyTo, sendId };
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const payload: Record<string, unknown> = {
      to: data.to,
      subject: data.subject,
      html: data.html,
      from: "Signhify <Piyushrajsingh092@gmail.com>",
    };
    if (data.replyTo) payload.reply_to = data.replyTo;

    const result = await callEdgeFunction("send-outreach-email", payload);

    if (data.sendId) {
      await supabaseAdmin
        .from("outreach_sends")
        .update({
          status: "sent",
          sent_at: new Date().toISOString(),
          provider_message_id: (result as { id?: string })?.id ?? null,
          error: null,
        })
        .eq("id", data.sendId);

      await supabaseAdmin.from("outreach_events").insert({
        send_id: data.sendId,
        type: "sent",
        payload: { provider: "resend", result },
      });
    }

    return { ok: true as const, provider: "resend", result };
  });

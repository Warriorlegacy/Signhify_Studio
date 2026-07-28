import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST")
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "content-type": "application/json" },
    });

  const resendKey = Deno.env.get("RESEND_API_KEY");
  if (!resendKey)
    return new Response(JSON.stringify({ error: "Missing RESEND_API_KEY" }), {
      status: 500,
      headers: { ...corsHeaders, "content-type": "application/json" },
    });

  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { ...corsHeaders, "content-type": "application/json" },
    });
  }

  const to = String(payload.to ?? "").trim();
  const subject = String(payload.subject ?? "").trim();
  const html = String(payload.html ?? "").trim();
  const from = String(payload.from ?? "Signhify <Piyushrajsingh092@gmail.com>");
  const replyTo = String(payload.reply_to ?? "").trim() || undefined;

  if (!to || !subject || !html)
    return new Response(JSON.stringify({ error: "to, subject, and html are required" }), {
      status: 400,
      headers: { ...corsHeaders, "content-type": "application/json" },
    });

  const body: Record<string, unknown> = {
    from,
    to: [to],
    subject,
    html,
  };
  if (replyTo) body.reply_to = replyTo;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${resendKey}`, "content-type": "application/json" },
    body: JSON.stringify(body),
  });

  const text = await res.text().catch(() => "");
  if (!res.ok)
    return new Response(JSON.stringify({ error: `Resend failed: ${res.status} ${text}` }), {
      status: 502,
      headers: { ...corsHeaders, "content-type": "application/json" },
    });

  return new Response(JSON.stringify({ ok: true, raw: text }), {
    headers: { ...corsHeaders, "content-type": "application/json" },
  });
});

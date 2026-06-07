import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
const corsHeaders = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type" };
async function tokenFor(email: string) {
  const data = new TextEncoder().encode(email.toLowerCase().trim());
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const { email, prompt_preview } = await req.json().catch(() => ({}));
  if (typeof email !== "string" || !email.includes("@")) return new Response(JSON.stringify({ error: "Valid email required" }), { status: 400, headers: { ...corsHeaders, "content-type": "application/json" } });
  const resendKey = Deno.env.get("RESEND_API_KEY");
  if (!resendKey) return new Response(JSON.stringify({ error: "Missing RESEND_API_KEY" }), { status: 500, headers: { ...corsHeaders, "content-type": "application/json" } });
  const token = await tokenFor(email);
  const confirmUrl = `https://signhify.online/confirm?token=${token}`;
  const html = `<div style="font-family:Inter,Arial,sans-serif;background:#0d0f1a;color:#fff;padding:32px"><div style="max-width:560px;margin:0 auto;background:#151827;border:1px solid rgba(255,255,255,.12);border-radius:18px;padding:28px"><h1 style="margin:0 0 12px">Confirm your Signhify early access</h1><p style="color:#c7cada;line-height:1.6">You're one click away from joining the Signhify AI early-access list.</p>${prompt_preview ? `<p style="color:#9ca3af;font-size:13px">Prompt preview: ${String(prompt_preview).slice(0, 180)}</p>` : ""}<a href="${confirmUrl}" style="display:inline-block;margin-top:18px;background:#ff6b00;color:#111827;text-decoration:none;font-weight:700;padding:12px 18px;border-radius:12px">Confirm early access</a><p style="color:#7b8194;font-size:12px;margin-top:24px">If you didn't request this, ignore this email.</p></div></div>`;
  const res = await fetch("https://api.resend.com/emails", { method: "POST", headers: { "authorization": `Bearer ${resendKey}`, "content-type": "application/json" }, body: JSON.stringify({ from: "Signhify <hello@signhify.online>", to: [email], subject: "Confirm your Signhify early access", html }) });
  if (!res.ok) return new Response(JSON.stringify({ error: "Resend request failed" }), { status: 502, headers: { ...corsHeaders, "content-type": "application/json" } });
  return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, "content-type": "application/json" } });
});

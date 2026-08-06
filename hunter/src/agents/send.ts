import { env } from "../lib/env";
import { db, now, row } from "../lib/db.server";
import { event } from "../lib/events.server";
import type { Lead, Message } from "./types";

export const FOOTER = (unsubUrl: string) =>
  `\n\n—\n${env.fromName}\n${env.physicalAddress}\nIf you'd rather not hear from us: ${unsubUrl}`;

export function unsubscribeUrl(email: string): string {
  const token = Buffer.from(`${email}:${env.siteUrl}`).toString("base64url");
  return `${env.siteUrl}/unsubscribe?email=${encodeURIComponent(email)}&token=${token}`;
}

export async function sendMessage(messageId: number): Promise<{ status: string }> {
  const message = row<Message>("SELECT * FROM messages WHERE id = ?", messageId);
  if (!message) return { status: "missing" };
  if (message.status === "sent") return { status: "sent" };
  const lead = message.lead_id ? row<Lead>("SELECT * FROM leads WHERE id = ?", message.lead_id) : undefined;
  const to = lead?.contact_email;
  const unsub = to ? unsubscribeUrl(to) : "";
  const body = `${message.body ?? ""}${FOOTER(unsub)}`;

  if (env.sandbox || !env.resendKey || !to) {
    db.prepare(
      "UPDATE messages SET status = ?, sent_at = ?, provider_message_id = ? WHERE id = ?",
    ).run(env.sandbox ? "sent" : "queued", now(), env.sandbox ? `sandbox:${message.id}` : null, messageId);
    event("message_sent", { messageId, mode: env.sandbox ? "sandbox" : "no-email-or-key", to }, lead?.id);
    return { status: "sent" };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${env.resendKey}`, "content-type": "application/json" },
    body: JSON.stringify({
      from: `${env.fromName} <${env.fromEmail}>`,
      to: [to],
      subject: message.subject ?? "",
      text: body,
      headers: {
        "List-Unsubscribe": `<${unsub}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
    }),
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    event("message_bounced", { messageId, error: detail }, lead?.id);
    db.prepare("UPDATE messages SET status = 'failed' WHERE id = ?").run(messageId);
    throw new Error(`resend ${res.status}: ${detail.slice(0, 200)}`);
  }
  const data = (await res.json()) as { id: string };
  db.prepare("UPDATE messages SET status = 'sent', sent_at = ?, provider_message_id = ? WHERE id = ?").run(
    now(),
    data.id,
    messageId,
  );
  event("message_sent", { messageId, providerId: data.id }, lead?.id);
  return { status: "sent" };
}

export function isSuppressed(email: string): boolean {
  return Boolean(row<{ id: number }>("SELECT id FROM suppression WHERE email = ?", email.toLowerCase()));
}

import { createFileRoute } from "@tanstack/react-router";
import { db, now } from "../../lib/db.server";
import { event } from "../../lib/events.server";

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

const jsonBody = async (request: Request) => {
  try {
    return (await request.json()) as Record<string, unknown>;
  } catch {
    return {};
  }
};

export const Route = createFileRoute("/api/unsubscribe")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await jsonBody(request);
        const email = String(body.email ?? "").trim().toLowerCase();
        if (!email) return json({ error: "email required" }, 400);

        db.prepare("INSERT INTO suppression (email, reason, source, created_at) VALUES (?, ?, ?, ?)")
          .run(email, "unsubscribe", "unsubscribe-page", now());

        db.prepare(
          `UPDATE leads SET status = 'unsubscribed', updated_at = ? WHERE lower(contact_email) = ?`,
        ).run(now(), email);

        db.prepare(
          `UPDATE campaign_leads SET status = 'stopped' WHERE lead_id IN (SELECT id FROM leads WHERE lower(contact_email) = ?)`,
        ).run(email);

        event("lead_unsubscribed", { email });
        return json({ ok: true });
      },
    },
  },
});

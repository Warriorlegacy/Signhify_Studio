import { createFileRoute } from "@tanstack/react-router";
import { row, rows, db, now, parse } from "../../lib/db.server";
import { event } from "../../lib/events.server";
import { DEFAULT_ICP, type IcpRules } from "../../agents/qualify.server";

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

export const Route = createFileRoute("/api/settings")({
  server: {
    handlers: {
      GET: async () => {
        const icpRow = row<{ value: string }>("SELECT value FROM settings WHERE key = 'icp_rules'");
        const icp = parse<IcpRules>(icpRow?.value, DEFAULT_ICP);
        const suppression = rows(
          "SELECT email, reason, source, created_at FROM suppression ORDER BY created_at DESC LIMIT 50",
        );
        const domains = [
          { domain: "signhify.dev", status: process.env.HUNTER_RESEND_API_KEY ? "configured" : "missing-key" },
          { domain: "signhify.dpdns.org", status: "destination-only" },
        ];
        return json({
          icp,
          suppression,
          domains,
          env: {
            sandbox: (process.env.HUNTER_SANDBOX ?? "true") !== "false",
            llm: Boolean(process.env.HUNTER_OPENAI_API_KEY || process.env.HUNTER_ANTHROPIC_API_KEY),
            resend: Boolean(process.env.HUNTER_RESEND_API_KEY),
            fromEmail: process.env.HUNTER_FROM_EMAIL ?? "hunter@signhify.dev",
            fromName: process.env.HUNTER_FROM_NAME ?? "Piyush — Signhify Studio",
          },
        });
      },
      POST: async ({ request }) => {
        const body = await jsonBody(request);
        const action = body.action;
        if (action === "icp") {
          const icp = (body.icp as IcpRules) ?? {};
          db.prepare(
            "INSERT INTO settings (key, value) VALUES ('icp_rules', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
          ).run(JSON.stringify({ ...DEFAULT_ICP, ...icp }));
          event("setting_changed", { key: "icp_rules" });
          return json({ ok: true });
        }
        if (action === "remove-suppression") {
          db.prepare("DELETE FROM suppression WHERE email = ?").run(String(body.email ?? "").toLowerCase());
          return json({ ok: true });
        }
        return json({ error: "unknown action" }, 400);
      },
    },
  },
});

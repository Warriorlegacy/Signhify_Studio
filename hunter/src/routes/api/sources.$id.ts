import { createFileRoute } from "@tanstack/react-router";
import { rows, row } from "../../lib/db.server";
import { parse } from "../../lib/db.server";

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

export const Route = createFileRoute("/api/sources/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const source = row("SELECT * FROM sources WHERE id = ?", Number(params.id));
        if (!source) return json({ error: "not found" }, 404);
        const cfg = parse<Record<string, unknown>>((source as { config: string }).config, {});
        const leads = rows(
          "SELECT id, org_name, org_domain, tier, email_verdict, created_at FROM leads WHERE source_channel = ? ORDER BY id DESC LIMIT 50",
          (source as { channel: string }).channel,
        );
        return json({ source: { ...source, config: cfg }, leads });
      },
    },
  },
});

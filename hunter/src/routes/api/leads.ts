import { createFileRoute } from "@tanstack/react-router";
import { db, rows, row, now } from "../../lib/db.server";
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

export const Route = createFileRoute("/api/leads")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const q = url.searchParams;
        const where: string[] = [];
        const params: (string | number)[] = [];
        const tier = q.get("tier");
        const source = q.get("source");
        const verdict = q.get("verdict");
        const search = q.get("q");
        if (tier && tier !== "all") {
          where.push("tier = ?");
          params.push(tier);
        }
        if (source && source !== "all") {
          where.push("source_channel = ?");
          params.push(source);
        }
        if (verdict && verdict !== "all") {
          where.push("email_verdict = ?");
          params.push(verdict);
        }
        if (search) {
          where.push("(org_name LIKE ? OR contact_email LIKE ? OR org_domain LIKE ?)");
          params.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }
        const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
        const limit = Math.min(Number(q.get("limit") ?? 200), 500);
        params.push(limit);
        const leads = rows(
          `SELECT * FROM leads ${whereSql} ORDER BY score DESC, id DESC LIMIT ?`,
          ...params,
        );
        return json({ leads });
      },
      POST: async ({ request }) => {
        const body = await jsonBody(request);
        const action = body.action;
        if (action === "tier") {
          const ids = (body.ids as number[]) ?? [];
          const tier = String(body.tier ?? "C");
          for (const id of ids) {
            db.prepare("UPDATE leads SET tier = ?, updated_at = ? WHERE id = ?").run(tier, now(), id);
            event("lead_tier_changed", { leadId: id, tier }, id);
          }
          return json({ ok: true, updated: ids.length });
        }
        return json({ error: "unknown action" }, 400);
      },
    },
  },
});

import { createFileRoute } from "@tanstack/react-router";
import { db, rows, row, now, parse } from "../../lib/db.server";
import { enqueue } from "../../lib/queue.server";
import { adapterChannels } from "../../agents/scout.server";

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

export const Route = createFileRoute("/api/sources")({
  server: {
    handlers: {
      GET: async () => {
        const sources = rows("SELECT * FROM sources ORDER BY id DESC");
        return json({ sources, channels: adapterChannels });
      },
      POST: async ({ request }) => {
        const body = await jsonBody(request);
        if (body.action === "create") {
          const channel = String(body.channel ?? "");
          const name = String(body.name ?? channel);
          const config = (body.config as Record<string, unknown>) ?? {};
          if (!adapterChannels.includes(channel)) return json({ error: `unknown channel: ${channel}` }, 400);
          const id = Number(
            db.prepare(
              "INSERT INTO sources (channel, name, config, enabled, created_at) VALUES (?,?,?,?,?)",
            ).run(channel, name, JSON.stringify(config), 1, now()).lastInsertRowid,
          );
          return json({ ok: true, id });
        }
        if (body.action === "toggle") {
          const id = Number(body.id);
          const source = row<{ enabled: number }>("SELECT enabled FROM sources WHERE id = ?", id);
          if (!source) return json({ error: "not found" }, 404);
          db.prepare("UPDATE sources SET enabled = ? WHERE id = ?").run(source.enabled ? 0 : 1, id);
          return json({ ok: true });
        }
        if (body.action === "run") {
          const id = Number(body.id);
          const source = row<{ channel: string; name: string }>("SELECT channel, name FROM sources WHERE id = ?", id);
          if (!source) return json({ error: "not found" }, 404);
          enqueue("scout", { sourceId: id }, `scout:${id}:${Date.now()}`);
          return json({ ok: true, queued: true });
        }
        if (body.action === "delete") {
          db.prepare("DELETE FROM sources WHERE id = ?").run(Number(body.id));
          return json({ ok: true });
        }
        return json({ error: "unknown action" }, 400);
      },
    },
  },
});

import { createFileRoute } from "@tanstack/react-router";
import { rows, row } from "../../lib/db.server";

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

export const Route = createFileRoute("/api/leads/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const lead = row("SELECT * FROM leads WHERE id = ?", Number(params.id));
        if (!lead) return json({ error: "not found" }, 404);
        const history = rows(
          "SELECT * FROM events WHERE lead_id = ? ORDER BY id DESC LIMIT 20",
          Number(params.id),
        );
        const messages = rows(
          "SELECT * FROM messages WHERE lead_id = ? ORDER BY id DESC LIMIT 10",
          Number(params.id),
        );
        return json({ lead, history, messages });
      },
    },
  },
});

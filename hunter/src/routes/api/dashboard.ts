import { createFileRoute } from "@tanstack/react-router";
import { rows, row, type SQLInputValue } from "../../lib/db.server";
import { recentEvents } from "../../lib/events.server";

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

export const Route = createFileRoute("/api/dashboard")({
  server: {
    handlers: {
      GET: async () => {
        const count = (sql: string, ...p: SQLInputValue[]) =>
          (row<{ c: number }>(sql, ...p)?.c ?? 0);

        const total = count("SELECT COUNT(*) c FROM leads");
        const verified = count("SELECT COUNT(*) c FROM leads WHERE email_verdict = 'verified'");
        const tierA = count("SELECT COUNT(*) c FROM leads WHERE tier = 'A'");
        const sent = count("SELECT COUNT(*) c FROM messages WHERE direction = 'out' AND status = 'sent'");
        const replied = count("SELECT COUNT(*) c FROM threads");
        const meetings = count("SELECT COUNT(*) c FROM leads WHERE status = 'meeting'");
        const unsubs = count("SELECT COUNT(*) c FROM suppression");
        const pendingJobs = count("SELECT COUNT(*) c FROM jobs WHERE status = 'pending'");
        const failedJobs = count("SELECT COUNT(*) c FROM jobs WHERE status = 'failed'");

        const funnel = [
          { stage: "sourced", value: total, pct: 100 },
          { stage: "verified", value: verified, pct: total ? Math.round((verified / total) * 100) : 0 },
          { stage: "qualified (A)", value: tierA, pct: total ? Math.round((tierA / total) * 100) : 0 },
          { stage: "contacted", value: sent, pct: total ? Math.round((sent / total) * 100) : 0 },
          { stage: "replied", value: replied, pct: total ? Math.round((replied / total) * 100) : 0 },
          { stage: "meetings", value: meetings, pct: total ? Math.round((meetings / total) * 100) : 0 },
        ];

        const byChannel = rows<{ source_channel: string; c: number }>(
          "SELECT source_channel, COUNT(*) c FROM leads GROUP BY source_channel ORDER BY c DESC",
        );

        return json({
          kpis: { total, verified, tierA, sent, replied, meetings, unsubs, pendingJobs, failedJobs },
          funnel,
          byChannel,
          events: recentEvents(30),
          sandbox: (process.env.HUNTER_SANDBOX ?? "true") !== "false",
        });
      },
    },
  },
});

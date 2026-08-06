import { createFileRoute } from "@tanstack/react-router";
import { db, rows, row, now, parse } from "../../lib/db.server";
import { enqueue } from "../../lib/queue.server";
import { event } from "../../lib/events.server";
import { composeMessage } from "../../agents/writer.server";
import type { Lead, Campaign, CampaignStep } from "../../agents/types";

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

export const Route = createFileRoute("/api/campaigns")({
  server: {
    handlers: {
      GET: async () => {
        const campaigns = rows("SELECT * FROM campaigns ORDER BY id DESC");
        const out = campaigns.map((c) => {
          const campaign = c as Campaign;
          const stats = row<{ queued: number; complete: number; total: number }>(
            `SELECT COUNT(*) total,
             SUM(CASE WHEN status IN ('queued') THEN 1 ELSE 0 END) queued,
             SUM(CASE WHEN status = 'complete' THEN 1 ELSE 0 END) complete
             FROM campaign_leads WHERE campaign_id = ?`,
            campaign.id,
          );
          return { ...campaign, stats: stats ?? { total: 0, queued: 0, complete: 0 } };
        });
        return json({ campaigns: out });
      },
      POST: async ({ request }) => {
        const body = await jsonBody(request);
        const action = body.action;
        if (action === "create") {
          const name = String(body.name ?? "Untitled campaign");
          const tier = String(body.tier ?? "A");
          const steps = (body.steps as Array<{ delay_days: number; subject: string; body: string }>) ?? [];
          if (steps.length === 0) return json({ error: "at least one step required" }, 400);
          const id = Number(
            db.prepare(
              "INSERT INTO campaigns (name, status, audience, created_at, updated_at) VALUES (?, 'draft', ?, ?, ?)",
            ).run(name, JSON.stringify({ tier }), now(), now()).lastInsertRowid,
          );
          steps.forEach((s, i) => {
            db.prepare(
              "INSERT INTO campaign_steps (campaign_id, step_order, channel, delay_days, subject_template, body_template) VALUES (?,?,?,?,?,?)",
            ).run(id, i, "email", Number(s.delay_days ?? 0), s.subject ?? "", s.body ?? "");
          });
          event("campaign_created", { campaignId: id, name });
          return json({ ok: true, id });
        }
        if (action === "launch") {
          const id = Number(body.id);
          const campaign = row<Campaign>("SELECT * FROM campaigns WHERE id = ?", id);
          if (!campaign) return json({ error: "not found" }, 404);
          db.prepare("UPDATE campaigns SET status = 'running', updated_at = ? WHERE id = ?").run(now(), id);
          enqueue("campaign_prepare", { campaignId: id }, `campaign_prepare:${id}`);
          return json({ ok: true });
        }
        if (action === "pause") {
          const id = Number(body.id);
          db.prepare("UPDATE campaigns SET status = 'paused', updated_at = ? WHERE id = ?").run(now(), id);
          return json({ ok: true });
        }
        if (action === "preview") {
          const tier = String(body.tier ?? "A");
          const step = (body.step as { subject: string; body: string }) ?? { subject: "", body: "" };
          const leads = rows<Lead>(
            `SELECT * FROM leads WHERE tier = ? AND contact_email IS NOT NULL AND email_verdict = 'verified'
             AND status NOT IN ('unsubscribed','archived') ORDER BY score DESC LIMIT 5`,
            tier,
          );
          const samples = await Promise.all(
            leads.map(async (lead) => ({
              leadId: lead.id,
              org: lead.org_name,
              contact: lead.contact_name,
              ...(await composeMessage(lead, step.subject ?? "", step.body ?? "")),
            })),
          );
          return json({ samples });
        }
        return json({ error: "unknown action" }, 400);
      },
    },
  },
});

import { createFileRoute } from "@tanstack/react-router";
import { row, rows, parse } from "../../lib/db.server";
import type { Campaign, CampaignStep } from "../../agents/types";

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

export const Route = createFileRoute("/api/campaigns/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const id = Number(params.id);
        const campaign = row<Campaign>("SELECT * FROM campaigns WHERE id = ?", id);
        if (!campaign) return json({ error: "not found" }, 404);
        const steps = rows<CampaignStep>(
          "SELECT * FROM campaign_steps WHERE campaign_id = ? ORDER BY step_order",
          id,
        );
        const leads = rows(
          `SELECT cl.*, l.org_name, l.contact_email, l.contact_name, l.tier
           FROM campaign_leads cl JOIN leads l ON l.id = cl.lead_id
           WHERE cl.campaign_id = ? ORDER BY cl.id DESC LIMIT 100`,
          id,
        );
        const messages = rows(
          `SELECT m.*, l.org_name FROM messages m JOIN leads l ON l.id = m.lead_id
           WHERE m.campaign_id = ? ORDER BY m.id DESC LIMIT 100`,
          id,
        );
        return json({ campaign: { ...campaign, audience: parse(campaign.audience, {}) }, steps, leads, messages });
      },
    },
  },
});

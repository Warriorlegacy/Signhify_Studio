import { db, now, row, rows, tx, parse } from "./db.server";
import { enqueue, worker, cronJob } from "./queue.server";
import { event } from "./events.server";
import { scoutSource } from "../agents/scout.server";
import { verifyEmail } from "../agents/verify";
import { scoreLead, DEFAULT_ICP, type IcpRules } from "../agents/qualify.server";
import { composeMessage } from "../agents/writer.server";
import { sendMessage, isSuppressed } from "../agents/send";
import { classifyReply } from "../agents/respond";
import type { Lead, Campaign, CampaignStep, Thread, Message } from "../agents/types";

const upsertLead = (input: {
  orgName: string;
  orgDomain: string;
  website?: string;
  industry?: string;
  country?: string;
  contactName?: string;
  contactRole?: string;
  contactEmail?: string;
  sourceChannel: string;
  sourceUrl: string;
  sourceRaw?: Record<string, unknown>;
}): Lead | undefined => {
  const existing = row<Lead>("SELECT * FROM leads WHERE org_domain = ?", input.orgDomain.toLowerCase());
  if (existing) return undefined;
  const verdict = input.contactEmail ? "unknown" : "none";
  const ts = now();
  const id = db
    .prepare(
      `INSERT INTO leads (org_name, org_domain, website, industry, country, contact_name, contact_role,
        contact_email, source_channel, source_url, source_raw, email_verdict, created_at, updated_at)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    )
    .run(
      input.orgName.slice(0, 200), input.orgDomain.toLowerCase(), input.website ?? null,
      input.industry ?? null, input.country ?? null, input.contactName ?? null,
      input.contactRole ?? null, input.contactEmail ?? null, input.sourceChannel,
      input.sourceUrl, JSON.stringify(input.sourceRaw ?? null), verdict, ts, ts,
    ).lastInsertRowid;
  return row<Lead>("SELECT * FROM leads WHERE id = ?", Number(id));
};

function icpRules(): IcpRules {
  const s = row<{ value: string }>("SELECT value FROM settings WHERE key = 'icp_rules'");
  return parse<IcpRules>(s?.value, DEFAULT_ICP);
}

async function runScout(sourceId: number): Promise<void> {
  const source = row<{ id: number; channel: string; name: string; config: string; enabled: number }>(
    "SELECT * FROM sources WHERE id = ?",
    sourceId,
  );
  if (!source || !source.enabled) return;
  const config = parse<Record<string, unknown>>(source.config, {});
  try {
    const found = await scoutSource(source.channel, config);
    let created = 0;
    for (const item of found) {
      const lead = upsertLead(item);
      if (lead) {
        created++;
        event("lead_created", { source: source.channel, domain: lead.org_domain }, lead.id);
        if (lead.contact_email) enqueue("verify", { leadId: lead.id, email: lead.contact_email }, `verify:${lead.id}`);
        enqueue("qualify", { leadId: lead.id }, `qualify:${lead.id}`);
      }
    }
    db.prepare(
      "UPDATE sources SET last_run_at = ?, last_run_count = ?, last_error = NULL WHERE id = ?",
    ).run(now(), created, sourceId);
    event("scout_run", { sourceId, channel: source.channel, found: found.length, created });
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    db.prepare("UPDATE sources SET last_error = ?, last_run_at = ? WHERE id = ?").run(error, now(), sourceId);
    event("scout_error", { sourceId, channel: source.channel, error });
    throw err;
  }
}

async function runVerify(leadId: number, email: string): Promise<void> {
  if (isSuppressed(email)) {
    db.prepare("UPDATE leads SET email_verdict = 'failed', status = 'unsubscribed', updated_at = ? WHERE id = ?").run(now(), leadId);
    return;
  }
  const verdict = await verifyEmail(email);
  db.prepare("UPDATE leads SET email_verdict = ?, updated_at = ? WHERE id = ?").run(verdict, now(), leadId);
  event("lead_verified", { leadId, email, verdict }, leadId);
  enqueue("qualify", { leadId }, `qualify:${leadId}`);
}

async function runQualify(leadId: number): Promise<void> {
  const lead = row<Lead>("SELECT * FROM leads WHERE id = ?", leadId);
  if (!lead) return;
  const { score, tier, reason } = scoreLead(lead, icpRules());
  db.prepare("UPDATE leads SET score = ?, tier = ?, score_reason = ?, updated_at = ? WHERE id = ?").run(
    score, tier, reason, now(), leadId,
  );
  event("lead_qualified", { leadId, score, tier, reason }, leadId);
}

async function prepareCampaign(campaignId: number): Promise<void> {
  const campaign = row<Campaign>("SELECT * FROM campaigns WHERE id = ?", campaignId);
  if (!campaign) return;
  const audience = parse<{ tier: string }>(campaign.audience, { tier: "A" });
  const leads = rows<Lead>(
    "SELECT * FROM leads WHERE tier = ? AND contact_email IS NOT NULL AND email_verdict = 'verified' AND status NOT IN ('unsubscribed','archived')",
    audience.tier ?? "A",
  );
  tx(() => {
    for (const lead of leads) {
      const exists = row<{ id: number }>(
        "SELECT id FROM campaign_leads WHERE campaign_id = ? AND lead_id = ?",
        campaignId, lead.id,
      );
      if (exists) continue;
      db.prepare(
        "INSERT INTO campaign_leads (campaign_id, lead_id, step_index, next_send_at, status) VALUES (?,?,?,?,?)",
      ).run(campaignId, lead.id, 0, now(), "queued");
    }
  });
  event("campaign_launched", { campaignId, leads: leads.length }, undefined);
}

async function runSend(campaignId: number, leadId: number, stepIndex: number): Promise<void> {
  const cl = row<{ id: number; status: string }>(
    "SELECT * FROM campaign_leads WHERE campaign_id = ? AND lead_id = ?",
    campaignId, leadId,
  );
  if (!cl || cl.status !== "queued") return;
  const lead = row<Lead>("SELECT * FROM leads WHERE id = ?", leadId);
  const step = row<CampaignStep>(
    "SELECT * FROM campaign_steps WHERE campaign_id = ? ORDER BY step_order LIMIT 1 OFFSET ?",
    campaignId, stepIndex,
  );
  if (!lead || !step || !lead.contact_email) return;
  if (isSuppressed(lead.contact_email)) {
    db.prepare("UPDATE campaign_leads SET status = 'stopped' WHERE id = ?").run(cl.id);
    return;
  }
  const { subject, body } = await composeMessage(lead, step.subject_template, step.body_template);
  const messageId = Number(
    db.prepare(
      "INSERT INTO messages (lead_id, campaign_id, channel, direction, subject, body, status, created_at) VALUES (?,?,?,?,?,?, 'queued', ?)",
    ).run(leadId, campaignId, step.channel, "out", subject, body, now()).lastInsertRowid,
  );
  event("message_written", { leadId, campaignId, messageId, step: stepIndex }, leadId);
  const nextStep = stepIndex + 1;
  const hasNext = row<CampaignStep>(
    "SELECT id, delay_days FROM campaign_steps WHERE campaign_id = ? ORDER BY step_order LIMIT 1 OFFSET ?",
    campaignId, nextStep,
  );
  const nextAt = hasNext ? new Date(Date.now() + (hasNext.delay_days ?? 0) * 86_400_000).toISOString() : null;
  db.prepare(
    "UPDATE campaign_leads SET step_index = ?, next_send_at = ?, status = ? WHERE id = ?",
  ).run(nextStep, nextAt, hasNext ? "queued" : "complete", cl.id);
  await sendMessage(messageId);
}

function schedulerTick(): void {
  const due = rows<{ campaign_id: number; lead_id: number; step_index: number }>(
    `SELECT cl.campaign_id, cl.lead_id, cl.step_index FROM campaign_leads cl
     JOIN campaigns c ON c.id = cl.campaign_id
     WHERE cl.status = 'queued' AND (cl.next_send_at IS NULL OR cl.next_send_at <= ?) AND c.status = 'running'`,
    now(),
  );
  for (const d of due.slice(0, 50)) {
    enqueue("campaign_send", d, `campaign_send:${d.campaign_id}:${d.lead_id}:${d.step_index}`);
  }
}

async function runClassify(threadId: number, body: string): Promise<void> {
  const thread = row<Thread>("SELECT * FROM threads WHERE id = ?", threadId);
  if (!thread) return;
  const { category, suggestion } = await classifyReply(body);
  db.prepare("UPDATE threads SET category = ?, suggestion = ?, updated_at = ? WHERE id = ?").run(
    category, suggestion || null, now(), threadId,
  );
  if (category === "unsub") {
    const lead = thread.lead_id ? row<Lead>("SELECT * FROM leads WHERE id = ?", thread.lead_id) : undefined;
    if (lead?.contact_email) {
      db.prepare("INSERT OR IGNORE INTO suppression (email, reason, source, created_at) VALUES (?,?,?,?)").run(
        lead.contact_email.toLowerCase(), "reply unsubscribe", "inbox", now(),
      );
      db.prepare("UPDATE leads SET status = 'unsubscribed', updated_at = ? WHERE id = ?").run(now(), lead.id);
      db.prepare("UPDATE campaign_leads SET status = 'stopped' WHERE lead_id = ?").run(lead.id);
      event("lead_unsubscribed", { threadId, leadId: lead.id }, lead.id);
    }
  }
  event("reply_classified", { threadId, category }, thread.lead_id ?? undefined);
}

export function startEngine(): void {
  worker<{ sourceId: number }>("scout", ({ sourceId }) => runScout(sourceId));
  worker<{ leadId: number; email: string }>("verify", ({ leadId, email }) => runVerify(leadId, email));
  worker<{ leadId: number }>("qualify", ({ leadId }) => runQualify(leadId));
  worker<{ campaignId: number }>("campaign_prepare", ({ campaignId }) => prepareCampaign(campaignId));
  worker<{ campaignId: number; leadId: number; step_index: number }>(
    "campaign_send",
    ({ campaignId, leadId, step_index }) => runSend(campaignId, leadId, step_index),
  );
  worker<{ threadId: number; body: string }>("classify", ({ threadId, body }) => runClassify(threadId, body));

  cronJob("scheduler", 30_000, schedulerTick);
  cronJob("cleanup", 3600_000, () => {
    const cutoff = new Date(Date.now() - 90 * 86_400_000).toISOString();
    const stale = rows<Lead>("SELECT id FROM leads WHERE status = 'new' AND created_at < ?", cutoff);
    for (const l of stale) db.prepare("UPDATE leads SET status = 'archived', updated_at = ? WHERE id = ?").run(now(), l.id);
  });
}

export { runVerify, runQualify };

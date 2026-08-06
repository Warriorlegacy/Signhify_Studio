import "./smoke-env";
import { initSchema } from "../src/lib/schema";
import { db, now, row, rows } from "../src/lib/db.server";
import { enqueue } from "../src/lib/queue.server";
import { startEngine } from "../src/lib/engine";
import { isSuppressed, unsubscribeUrl, FOOTER } from "../src/agents/send";

initSchema();
startEngine();

let failures = 0;
function check(name: string, ok: boolean, extra = ""): void {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${extra ? ` — ${extra}` : ""}`);
  if (!ok) failures++;
}

const waitFor = async (name: string, fn: () => boolean, timeoutMs = 25_000) => {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (fn()) return true;
    await new Promise((r) => setTimeout(r, 500));
  }
  check(name, false, "timeout");
  return false;
};

async function main(): Promise<void> {
  // 1. Source → scout → leads
  const sourceId = Number(
    db.prepare(
      "INSERT INTO sources (channel, name, config, created_at) VALUES (?,?,?,?)",
    ).run(
      "hnalgolia", "smoke-hn",
      JSON.stringify({ queries: ['"need a developer" build'] }),
      now(),
    ).lastInsertRowid,
  );
  enqueue("scout", { sourceId }, `scout:${sourceId}`);
  await waitFor("scout created lead(s)", () => {
    const c = row<{ c: number }>("SELECT COUNT(*) c FROM leads WHERE source_channel = 'hackernews'");
    return (c?.c ?? 0) > 0;
  });
  const lead = row<{ id: number; org_domain: string; contact_email: string | null; tier: string; email_verdict: string }>(
    "SELECT * FROM leads WHERE source_channel = 'hackernews' LIMIT 1",
  );
  check("lead exists", Boolean(lead), lead?.org_domain ?? "none");

  // 2. Qualify is deterministic → tier assigned
  if (lead) {
    await waitFor("lead qualified (tier != C)", () =>
      (row<{ tier: string }>("SELECT tier FROM leads WHERE id = ?", lead.id)?.tier ?? "C") !== "C",
    );
  }

  // 2b. Seed a lead with a real email (HN hits carry none) → qualify through the queue
  //     (verify job skipped: email_verdict stays 'verified' as seeded; SMTP probing is env-dependent)
  const seededId = Number(
    db.prepare(
      "INSERT INTO leads (org_name, org_domain, website, contact_email, contact_name, tier, email_verdict, status, source_channel, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
    ).run(
      "Smoke Test Corp", "smoketest.dev", "https://smoketest.dev",
      "ceo@smoketest.dev", "Test CEO", "C", "verified", "new", "smoke", now(), now(),
    ).lastInsertRowid,
  );
  enqueue("qualify", { leadId: seededId }, `qualify:${seededId}`);
  const seededTier = await (async () => {
    await waitFor("seeded lead qualified", () =>
      (row<{ tier: string }>("SELECT tier FROM leads WHERE id = ?", seededId)?.tier ?? "C") !== "C",
    );
    return row<{ tier: string }>("SELECT tier FROM leads WHERE id = ?", seededId)?.tier ?? "A";
  })();

  // 3. Campaign → prepare → send in sandbox
  const campaignId = Number(
    db.prepare("INSERT INTO campaigns (name, status, audience, created_at, updated_at) VALUES (?,?,?,?,?)").run(
      "smoke-campaign", "running", JSON.stringify({ tier: seededTier }), now(), now(),
    ).lastInsertRowid,
  );
  db.prepare(
    "INSERT INTO campaign_steps (campaign_id, step_order, channel, delay_days, subject_template, body_template) VALUES (?,?,?,?,?,?)",
  ).run(campaignId, 0, "email", 0, "Hi {{lead.orgName}}", "Hey {{lead.contactName}},\n\nTest body.\n\nBest,\nPiyush");
  enqueue("campaign_prepare", { campaignId }, `prepare:${campaignId}`);
  await waitFor("campaign_prepare loaded leads", () =>
    (row<{ c: number }>("SELECT COUNT(*) c FROM campaign_leads WHERE campaign_id = ?", campaignId)?.c ?? 0) > 0,
  );
  const cl = row<{ lead_id: number }>("SELECT lead_id FROM campaign_leads WHERE campaign_id = ? LIMIT 1", campaignId);
  check("campaign loaded ≥1 lead", Boolean(cl));
  if (cl) {
    enqueue(
      "campaign_send",
      { campaignId, leadId: cl.lead_id, step_index: 0 },
      `send:${campaignId}:${cl.lead_id}:0`,
    );
    await waitFor("message sent (sandbox)", () => {
      const m = row<{ status: string; provider_message_id: string | null }>(
        "SELECT * FROM messages WHERE campaign_id = ? ORDER BY id DESC LIMIT 1", campaignId,
      );
      return Boolean(m && m.status === "sent" && m.provider_message_id?.startsWith("sandbox:"));
    });
    const msg = row<{ provider_message_id: string }>(
      "SELECT * FROM messages WHERE campaign_id = ? ORDER BY id DESC LIMIT 1", campaignId,
    );
    check("sandbox provider id", Boolean(msg?.provider_message_id?.startsWith("sandbox:")), msg?.provider_message_id ?? "none");
    check("footer embeds unsubscribe link", FOOTER(unsubscribeUrl("x@y.dev")).includes("unsubscribe"));
  }

  // 4. Compliance: suppression blocks sends forever
  //    Fresh campaign + exclusive lead so prior sends can't pollute the counts.
  const suppressedEmail = "blocked@smoketest.dev";
  const suppressedId = Number(
    db.prepare(
      "INSERT INTO leads (org_name, org_domain, website, contact_email, contact_name, tier, email_verdict, status, source_channel, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
    ).run(
      "Blocked Corp", "blocked.dev", "https://blocked.dev",
      suppressedEmail, "Blocked CEO", seededTier, "verified", "new", "smoke", now(), now(),
    ).lastInsertRowid,
  );
  db.prepare("INSERT INTO suppression (email, reason, source, created_at) VALUES (?,?,?,?)").run(
    suppressedEmail, "test", "smoke", now(),
  );
  check("isSuppressed true", isSuppressed(suppressedEmail));

  const camp2 = Number(
    db.prepare("INSERT INTO campaigns (name, status, audience, created_at, updated_at) VALUES (?,?,?,?,?)").run(
      "smoke-blocked", "running", JSON.stringify({ tier: seededTier }), now(), now(),
    ).lastInsertRowid,
  );
  db.prepare("UPDATE leads SET status = 'unsubscribed', updated_at = ? WHERE id = ?").run(now(), seededId);
  db.prepare(
    "INSERT INTO campaign_steps (campaign_id, step_order, channel, delay_days, subject_template, body_template) VALUES (?,?,?,?,?,?)",
  ).run(camp2, 0, "email", 0, "Hi {{lead.orgName}}", "Test body.");
  enqueue("campaign_prepare", { campaignId: camp2 }, `prepare:${camp2}`);
  await waitFor("campaign2 prepared", () =>
    (row<{ c: number }>("SELECT COUNT(*) c FROM campaign_leads WHERE campaign_id = ?", camp2)?.c ?? 0) > 0,
  );
  const cl2 = row<{ id: number; status: string }>(
    "SELECT * FROM campaign_leads WHERE campaign_id = ?", camp2,
  ) as { id: number; status: string } | undefined;
  check("campaign2 loaded suppressed lead", Boolean(cl2), cl2?.status ?? "none");
  enqueue("campaign_send", { campaignId: camp2, leadId: suppressedId, step_index: 0 }, `send:${camp2}:${suppressedId}`);
  await waitFor("suppression send job processed", () =>
    (row<{ status: string }>("SELECT status FROM jobs WHERE idempotency_key = ?", `send:${camp2}:${suppressedId}`)?.status ?? "") === "done",
  );
  const cl2b = row<{ status: string }>(
    "SELECT status FROM campaign_leads WHERE campaign_id = ?", camp2,
  );
  check("suppressed lead: entry stopped after send attempt", cl2b?.status === "stopped", cl2b?.status ?? "none");
  const m2 = row<{ c: number }>(
    "SELECT COUNT(*) c FROM messages WHERE campaign_id = ? AND lead_id = ?", camp2, suppressedId,
  );
  check("suppressed lead: no message written", (m2?.c ?? 0) === 0);

  // 5. Thread classify + reply suggestion (rule-based, no network)
  const threadId = Number(
    db.prepare("INSERT INTO threads (subject, status, category, created_at, updated_at) VALUES (?,?,?,?,?)").run(
      "Re: proposal", "needs_reply", "other", now(), now(),
    ).lastInsertRowid,
  );
  enqueue("classify", { threadId, body: "Unsubscribe me please" }, `classify:${threadId}`);
  await waitFor("reply classified as unsub", () =>
    (row<{ category: string }>("SELECT category FROM threads WHERE id = ?", threadId)?.category ?? "") === "unsub",
  );

  console.log(failures === 0 ? "\nSMOKE OK — all checks passed" : `\nSMOKE FAILED — ${failures} check(s) failed`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error("SMOKE ERROR", err);
  process.exit(1);
});

import { createFileRoute } from "@tanstack/react-router";
import { computeLeadScore } from "@/lib/revenue/lead-score";
import { buildProposal } from "@/lib/revenue/auto-proposal";

type RunResult = {
  step: string;
  processed: number;
  errors: string[];
};

export const Route = createFileRoute("/api/cron/revenue")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json().catch(() => ({}))) as { secret?: string };
          const secret = body?.secret || "";
          const expected =
            process.env.CRON_REVENUE_SECRET ||
            "5ab4b9bb901631d6d58f6d29d5841e380ab6c9347170ecdd53916bf25631642d";

          if (!secret || secret !== expected) {
            return new Response(JSON.stringify({ error: "Unauthorized cron request" }), {
              status: 401,
              headers: { "Content-Type": "application/json" },
            });
          }

          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const results: RunResult[] = [];
          const now = new Date().toISOString();

          try {
            const { data: pendingSends, error: sendError } = await (supabaseAdmin as any)
              .from("outreach_sends")
              .select("*")
              .eq("status", "queued")
              .lte("scheduled_at", now)
              .limit(50);

            if (sendError) throw sendError;

            let sentCount = 0;
            const sendErrors: string[] = [];
            for (const send of pendingSends ?? []) {
              try {
                const resendRes = await fetch(
                  `${process.env.SUPABASE_URL?.replace(/\/$/, "")}/functions/v1/send-outreach-email`,
                  {
                    method: "POST",
                    headers: {
                      "content-type": "application/json",
                      authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
                    },
                    body: JSON.stringify({
                      to: send.prospect_email,
                      subject: send.subject,
                      html: send.body,
                      from: "Signhify <Piyushrajsingh092@gmail.com>",
                      reply_to: "Piyushrajsingh092@gmail.com",
                    }),
                  },
                );

                const json = await resendRes.json().catch(() => ({}));
                if (!resendRes.ok) {
                  sendErrors.push(`${send.prospect_email}: ${json?.error ?? resendRes.status}`);
                  await (supabaseAdmin as any)
                    .from("outreach_sends")
                    .update({ status: "failed", error: json?.error ?? String(resendRes.status) })
                    .eq("id", send.id);
                } else {
                  const providerMessageId = (json as { id?: string })?.id ?? null;
                  await (supabaseAdmin as any)
                    .from("outreach_sends")
                    .update({
                      status: "sent",
                      sent_at: now,
                      provider_message_id: providerMessageId,
                      error: null,
                    })
                    .eq("id", send.id);

                  await (supabaseAdmin as any).from("outreach_events").insert({
                    send_id: send.id,
                    type: "sent",
                    payload: { provider: "resend", messageId: providerMessageId },
                  });
                  sentCount++;
                }
              } catch (err) {
                const msg = err instanceof Error ? err.message : "unknown";
                sendErrors.push(`${send.prospect_email}: ${msg}`);
                await (supabaseAdmin as any)
                  .from("outreach_sends")
                  .update({ status: "failed", error: msg })
                  .eq("id", send.id);
              }
            }

            results.push({ step: "outreach", processed: sentCount, errors: sendErrors });

            const { data: allLeads, error: leadError } = await (supabaseAdmin as any)
              .from("leads")
              .select("*");

            if (leadError) throw leadError;
            let scoredCount = 0;
            const scoreErrors: string[] = [];
            for (const lead of allLeads) {
              try {
                const score = computeLeadScore({
                  type: lead.type,
                  scope: lead.scope,
                  budget: lead.budget,
                  timeline: lead.timeline,
                  goals: lead.goals ?? [],
                  company: lead.company ?? undefined,
                });

                await (supabaseAdmin as any).from("lead_scores").upsert(
                  {
                    lead_id: lead.id,
                    score: score.score,
                    tier: score.tier,
                    signals: score.signals,
                    suggested_offer: score.suggestedOffer,
                    suggested_next_action: score.suggestedNextAction,
                    updated_at: now,
                  },
                  { onConflict: "lead_id" },
                );

                if (score.tier === "hot" || score.tier === "warm") {
                  try {
                    const proposal = buildProposal({
                      leadId: lead.id,
                      name: lead.name,
                      email: lead.email,
                      company: lead.company ?? undefined,
                      type: lead.type,
                      scope: lead.scope,
                      budget: lead.budget,
                      timeline: lead.timeline,
                      goals: lead.goals ?? [],
                      score: score.score,
                      tier: score.tier,
                    });

                    await fetch(
                      `${process.env.SUPABASE_URL?.replace(/\/$/, "")}/functions/v1/send-outreach-email`,
                      {
                        method: "POST",
                        headers: {
                          "content-type": "application/json",
                          authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
                        },
                        body: JSON.stringify({
                          to: lead.email,
                          subject: `Your ${proposal.offerType} proposal from Signhify`,
                          html: `<p>Hi ${lead.name},</p><p>Based on your requirements, here's your custom ${proposal.offerType} proposal:</p><pre>${proposal.summary.replace(/</g, "&lt;")}</pre><p>Reply to this email or book a call to confirm.</p>`,
                          from: "Signhify <Piyushrajsingh092@gmail.com>",
                          reply_to: "Piyushrajsingh092@gmail.com",
                        }),
                      },
                    );

                    await (supabaseAdmin as any)
                      .from("auto_proposals")
                      .update({ status: "sent", sent_at: now })
                      .eq("lead_id", lead.id)
                      .eq("status", "draft");
                  } catch {
                    // ignore proposal send failure
                  }
                }

                scoredCount++;
              } catch (err) {
                scoreErrors.push(
                  `${lead.email}: ${err instanceof Error ? err.message : "unknown"}`,
                );
              }
            }

            results.push({ step: "lead_scoring", processed: scoredCount, errors: scoreErrors });
          } catch (err) {
            results.push({
              step: "global",
              processed: 0,
              errors: [err instanceof Error ? err.message : "Unknown cron error"],
            });
          }

          const totalProcessed = results.reduce((sum, r) => sum + r.processed, 0);
          const allErrors = results.flatMap((r) => r.errors);

          return new Response(
            JSON.stringify({
              ok: true as const,
              ranAt: now,
              totalProcessed,
              results,
              errors: allErrors,
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            },
          );
        } catch (err) {
          return new Response(
            JSON.stringify({ error: err instanceof Error ? err.message : "Cron failure" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});

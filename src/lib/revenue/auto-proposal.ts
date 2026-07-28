import { createServerFn } from "@tanstack/react-start";

type ProposalInput = {
  leadId: string;
  name: string;
  email: string;
  company?: string;
  type: string;
  scope: string;
  budget: string;
  timeline: string;
  goals: string[];
  score: number;
  tier: "hot" | "warm" | "cold";
};

function pickOffer(input: ProposalInput) {
  const normalizedBudget = input.budget.toLowerCase();
  if (normalizedBudget.includes("$15,000") || normalizedBudget.includes("$50,000") || input.tier === "hot") {
    return {
      offerType: "Platform",
      priceCents: 150000,
      timelineDays: 30,
      title: "Custom AI Platform Build",
    };
  }
  if (normalizedBudget.includes("$799") || normalizedBudget.includes("studio") || input.tier === "warm") {
    return {
      offerType: "Studio",
      priceCents: 79900,
      timelineDays: 7,
      title: "Signhify Studio Sprint",
    };
  }
  return {
    offerType: "Sprint",
    priceCents: 29900,
    timelineDays: 5,
    title: "Signhify Sprint",
  };
}

function buildMilestones(offerType: string, timelineDays: number) {
  if (offerType === "Sprint") {
    return [
      { day: 1, title: "Discovery & brief", description: "Align on goals, scope, and success metrics." },
      { day: 2, title: "Architecture & design", description: "Technical plan, stack selection, and UX direction." },
      { day: 3, title: "Build core", description: "Implement the primary workflow and AI integration." },
      { day: 4, title: "QA & polish", description: "Fix edge cases, optimize, and prepare for handoff." },
      { day: 5, title: "Delivery & walkthrough", description: "Deploy, record walkthrough, and hand over assets." },
    ];
  }
  if (offerType === "Studio") {
    return [
      { day: 1, title: "Discovery & blueprint", description: "Deep-dive into product requirements and user flows." },
      { day: 2, title: "Architecture & UX", description: "System design, component architecture, and visual direction." },
      { day: 3, title: "AI integration", description: "Wire AI capabilities, prompts, and automation." },
      { day: 4, title: "Full build", description: "End-to-end implementation with live preview." },
      { day: 5, title: "QA & hardening", description: "Performance tuning, security review, and bug fixes." },
      { day: 6, title: "Launch prep", description: "Deploy pipeline, monitoring, and handoff docs." },
      { day: 7, title: "Delivery", description: "Go live, walkthrough, and 7-day support window." },
    ];
  }
  return [
    { week: 1, title: "Discovery & roadmap", description: "Business goals, user research, and delivery roadmap." },
    { week: 2, title: "Architecture", description: "Scalable platform design, data model, and integrations." },
    { week: 3, title: "Core platform", description: "Authentication, billing, admin, and core workflows." },
    { week: 4, title: "AI layer", description: "AI capabilities, prompt systems, and automation." },
    { week: 5, title: "Integrations", description: "Third-party integrations, webhooks, and APIs." },
    { week: 6, title: "Testing & QA", description: "E2E tests, load tests, and security review." },
    { week: 7, title: "Launch", description: "Production deploy, monitoring, and handoff." },
  ];
}

function buildSummary(input: ProposalInput, offer: { offerType: string; priceCents: number; timelineDays: number; title: string }) {
  const price = `$${(offer.priceCents / 100).toLocaleString()}`;
  const goals = input.goals.map((g) => `- ${g}`).join("\n");
  return `${offer.title} proposal for ${input.name}${input.company ? ` at ${input.company}` : ""}.\n\nScope: ${input.scope}\nBudget band: ${input.budget}\nTimeline: ${offer.timelineDays} days\nPrice: ${price}\n\nGoals:\n${goals}\n\nNext step: confirm this scope and we'll kick off within 24 hours.`;
}

export const generateProposal = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const obj = input as Record<string, unknown>;
    const leadId = typeof obj?.leadId === "string" ? obj.leadId.trim() : "";
    const name = typeof obj?.name === "string" ? obj.name.trim() : "";
    const email = typeof obj?.email === "string" ? obj.email.trim() : "";
    const company = typeof obj?.company === "string" ? obj.company.trim() : undefined;
    const type = typeof obj?.type === "string" ? obj.type.trim() : "";
    const scope = typeof obj?.scope === "string" ? obj.scope.trim() : "";
    const budget = typeof obj?.budget === "string" ? obj.budget.trim() : "";
    const timeline = typeof obj?.timeline === "string" ? obj.timeline.trim() : "";
    const goals = Array.isArray(obj?.goals) ? obj.goals.map((g) => String(g).trim()).filter(Boolean) : [];
    const score = typeof obj?.score === "number" ? obj.score : 0;
    const tier = (obj?.tier === "hot" || obj?.tier === "warm" || obj?.tier === "cold") ? obj.tier : "cold";
    if (!leadId || !name || !email || !type || !scope || !budget || !timeline || goals.length === 0) {
      throw new Error("Missing required lead fields for proposal");
    }
    if (!email.includes("@")) throw new Error("Invalid email");
    return { leadId, name, email, company, type, scope, budget, timeline, goals, score, tier };
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const offer = pickOffer(data);
    const summary = buildSummary(data, offer);
    const milestones = buildMilestones(offer.offerType, offer.timelineDays);

    const { data: proposal, error } = await supabaseAdmin
      .from("auto_proposals")
      .insert({
        lead_id: data.leadId,
        offer_type: offer.offerType,
        price_cents: offer.priceCents,
        currency: "usd",
        timeline_days: offer.timelineDays,
        summary,
        milestones,
        status: "draft",
      })
      .select("id")
      .single();

    if (error || !proposal) {
      console.error("[auto-proposal] insert failed", error);
      throw new Error("Failed to generate proposal.");
    }

    return {
      proposalId: proposal.id,
      offerType: offer.offerType,
      priceCents: offer.priceCents,
      timelineDays: offer.timelineDays,
      summary,
      milestones,
    };
  });

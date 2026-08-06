import { createServerFn } from "@tanstack/react-start";

type LeadInput = {
  type: string;
  scope: string;
  budget: string;
  timeline: string;
  goals: string[];
  company?: string;
};

const BUDGET_SCORES: Record<string, number> = {
  "$299 sprint": 20,
  "$799 studio": 40,
  "$1,500+ platform": 60,
  "$15,000+": 80,
  "$50,000+": 100,
};

const URGENT_KEYWORDS = ["urgent", "asap", "immediately", "this week", "now", "rush"];
const ENTERPRISE_KEYWORDS = ["enterprise", "saas", "platform", "api", "integration", "scale"];

function scoreBudget(budget: string): number {
  const normalized = budget.toLowerCase();
  for (const [key, value] of Object.entries(BUDGET_SCORES)) {
    if (normalized.includes(key.split(" ")[0].replace("$", ""))) return value;
  }
  if (normalized.includes("$") || normalized.includes("usd")) return 30;
  return 10;
}

function scoreTimeline(timeline: string): number {
  const normalized = timeline.toLowerCase();
  if (normalized.includes("immediate") || normalized.includes("asap")) return 30;
  if (normalized.includes("week") && !normalized.includes("month")) return 20;
  if (normalized.includes("month")) return 10;
  return 5;
}

function scoreGoals(goals: string[]): number {
  const text = goals.join(" ").toLowerCase();
  let score = 0;
  for (const keyword of URGENT_KEYWORDS) {
    if (text.includes(keyword)) score += 10;
  }
  for (const keyword of ENTERPRISE_KEYWORDS) {
    if (text.includes(keyword)) score += 8;
  }
  return Math.min(score, 40);
}

function scoreScope(scope: string): number {
  const normalized = scope.toLowerCase();
  if (normalized.includes("full") || normalized.includes("platform")) return 30;
  if (normalized.includes("studio")) return 20;
  if (normalized.includes("sprint")) return 15;
  return 10;
}

export function computeLeadScore(input: LeadInput) {
  const budgetScore = scoreBudget(input.budget);
  const timelineScore = scoreTimeline(input.timeline);
  const goalsScore = scoreGoals(input.goals);
  const scopeScore = scoreScope(input.scope);
  const companyBonus = input.company && input.company.trim().length > 2 ? 10 : 0;

  const total = Math.min(budgetScore + timelineScore + goalsScore + scopeScore + companyBonus, 100);

  const tier = total >= 70 ? "hot" : total >= 40 ? "warm" : "cold";

  const signals = [
    { label: "budget", score: budgetScore, detail: input.budget },
    { label: "timeline", score: timelineScore, detail: input.timeline },
    { label: "goals", score: goalsScore, detail: input.goals.join(", ") },
    { label: "scope", score: scopeScore, detail: input.scope },
  ];

  let suggestedOffer = "Sprint ($299)";
  let suggestedNextAction = "Send automated Sprint proposal";

  if (total >= 70) {
    suggestedOffer = "Studio ($799) or Platform";
    suggestedNextAction = "Send Studio proposal + book call";
  } else if (total >= 40) {
    suggestedOffer = "Studio ($799)";
    suggestedNextAction = "Send case studies + nurture";
  }

  return {
    score: total,
    tier,
    signals,
    suggestedOffer,
    suggestedNextAction,
  };
}

export const scoreLead = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const obj = input as Record<string, unknown>;
    const type = typeof obj?.type === "string" ? obj.type.trim() : "";
    const scope = typeof obj?.scope === "string" ? obj.scope.trim() : "";
    const budget = typeof obj?.budget === "string" ? obj.budget.trim() : "";
    const timeline = typeof obj?.timeline === "string" ? obj.timeline.trim() : "";
    const goals = Array.isArray(obj?.goals)
      ? obj.goals.map((g) => String(g).trim()).filter(Boolean)
      : [];
    const company = typeof obj?.company === "string" ? obj.company.trim() : undefined;
    const leadId = typeof obj?.leadId === "string" ? obj.leadId : undefined;
    if (!type || !scope || !budget || !timeline || goals.length === 0) {
      throw new Error("type, scope, budget, timeline, and goals are required");
    }
    return { type, scope, budget, timeline, goals, company, leadId };
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const result = computeLeadScore(data);

    if (data.leadId) {
      const { error } = await (supabaseAdmin as any).from("lead_scores").upsert(
        {
          lead_id: data.leadId,
          score: result.score,
          tier: result.tier,
          signals: result.signals,
          suggested_offer: result.suggestedOffer,
          suggested_next_action: result.suggestedNextAction,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "lead_id" },
      );

      if (error) {
        console.error("[lead-score] upsert failed", error);
        throw new Error("Failed to save lead score.");
      }
    }

    return result;
  });

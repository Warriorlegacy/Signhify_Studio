import type { Lead } from "./types";

export type IcpRules = {
  sizeMax?: number;
  sizeMin?: number;
  countries?: string[];
  excludeCountries?: string[];
  signals?: string[];
  scoreWeight?: number;
};

export const DEFAULT_ICP: IcpRules = {
  sizeMin: 2,
  sizeMax: 500,
  countries: ["US", "UK", "EU", "AU", "IN", "CA", "AE", "SG"],
  excludeCountries: [],
  signals: [
    "agency", "developer", "hire", "build", "mvp", "automation", "website",
    "app", "saas", "ai", "startup", "founder", "looking for",
  ],
};

const SIGNAL_WEIGHT: Record<string, number> = {
  agency: 10, developer: 12, hire: 14, build: 12, mvp: 15, automation: 12,
  website: 8, app: 10, saas: 9, ai: 8, startup: 8, founder: 10, "looking for": 12,
};

function countryFromRaw(lead: Lead): string | undefined {
  const raw = lead.source_raw;
  return lead.country ?? (typeof raw === "object" && raw && "country" in raw ? String(raw.country) : undefined);
}

export function scoreLead(lead: Lead, rules: IcpRules = DEFAULT_ICP): { score: number; tier: "A" | "B" | "C"; reason: string } {
  const reason: string[] = [];
  let score = 0;
  const haystack = [
    lead.org_name, lead.org_domain, lead.contact_role, lead.contact_name,
    lead.industry, lead.source_raw ? JSON.stringify(lead.source_raw).slice(0, 800) : "",
  ].join(" ").toLowerCase();

  const hit = Object.entries(SIGNAL_WEIGHT).find(([s]) => haystack.includes(s));
  if (hit) {
    score += hit[1];
    reason.push(`signal "${hit[0]}"`);
  }
  const matched = Object.keys(SIGNAL_WEIGHT).filter((s) => haystack.includes(s));
  if (matched.length > 1) {
    score += (matched.length - 1) * 5;
    reason.push(`${matched.length} signals`);
  }

  if (lead.email_verdict === "verified") {
    score += 15;
    reason.push("verified email");
  } else if (lead.email_verdict === "risky") {
    score += 5;
  }

  if (lead.contact_role && /founder|cto|ceo|owner|director|head/i.test(lead.contact_role)) {
    score += 10;
    reason.push("decision maker");
  }

  const country = countryFromRaw(lead);
  if (country) {
    if (rules.excludeCountries?.some((c) => country.toUpperCase().startsWith(c.toUpperCase()))) {
      return { score: 0, tier: "C", reason: `excluded country: ${country}` };
    }
    if (rules.countries?.some((c) => country.toUpperCase().startsWith(c.toUpperCase()))) {
      score += 8;
      reason.push(`geo ${country}`);
    }
  }

  if (score >= 35) return { score, tier: "A", reason: reason.join(", ") || "strong signals" };
  if (score >= 15) return { score, tier: "B", reason: reason.join(", ") || "some signals" };
  return { score, tier: "C", reason: reason.join(", ") || "weak signals" };
}

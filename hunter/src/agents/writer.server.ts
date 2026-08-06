import { env, llmAvailable } from "../lib/env";
import type { Lead } from "./types";

const SUBJECT_FALLBACK = "A build question from Signhify (AI engineering studio)";
const BODY_FALLBACK = `Hi {{contactName}},

Saw that {{orgName}} might be working on {{interest}}. I run Signhify — an AI engineering studio (14+ shipped products). We help teams like yours go from idea to shipped product in ~14 days.

If that's useful, happy to jump on a quick call.

Best,
Piyush`;

export function renderTemplate(template: string, lead: Lead): string {
  const vars: Record<string, string> = {
    "lead.contactName": lead.contact_name ?? "there",
    "lead.orgName": lead.org_name || lead.org_domain,
    "lead.orgDomain": lead.org_domain,
    "lead.website": lead.website ?? "",
    "lead.role": lead.contact_role ?? "founder",
    "lead.industry": lead.industry ?? "your business",
    "lead.country": lead.country ?? "",
    "lead.sourceChannel": lead.source_channel,
  };
  return template.replace(/\{\{(lead\.\w+)\}\}/g, (_, key: string) => vars[key] ?? "");
}

async function llmPersonalize(prompt: string): Promise<string | null> {
  if (!llmAvailable() || !env.openaiKey) return null;
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { authorization: `Bearer ${env.openaiKey}`, "content-type": "application/json" },
      body: JSON.stringify({
        model: env.llmModel,
        temperature: 0.7,
        messages: [
          {
            role: "system",
            content:
              "You write concise B2B cold emails for an AI engineering studio. Max 120 words. Direct, cinematic, zero hype, never fabricate facts about the prospect. Output JSON: {\"subject\": string <= 60 chars, \"body\": string}.",
          },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
      }),
      signal: AbortSignal.timeout(20_000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { choices: Array<{ message: { content: string } }> };
    const parsed = JSON.parse(data.choices[0]?.message?.content ?? "{}") as { subject?: string; body?: string };
    if (!parsed.subject || !parsed.body) return null;
    return JSON.stringify(parsed);
  } catch {
    return null;
  }
}

export type WrittenMessage = { subject: string; body: string };

export async function composeMessage(
  lead: Lead,
  subjectTemplate: string,
  bodyTemplate: string,
): Promise<WrittenMessage> {
  const fallback: WrittenMessage = {
    subject: renderTemplate(subjectTemplate, lead) || SUBJECT_FALLBACK,
    body: renderTemplate(bodyTemplate || BODY_FALLBACK, lead),
  };
  const signal = lead.score_reason ? `Relevant signals: ${lead.score_reason}.` : "";
  const personalized = await llmPersonalize(
    `Prospect: ${lead.org_name} (${lead.website ?? lead.org_domain}, ${lead.industry ?? "unknown industry"}, ${lead.country ?? "unknown geo"}). Contact: ${lead.contact_name ?? "unknown"} (${lead.contact_role ?? "unknown role"}). Found via ${lead.source_channel} (${lead.source_url ?? "no url"}). ${signal}\n\nDraft the email. Studio sells: AI automation, SaaS builds, websites, LLM integrations, MVP in ~14 days.`,
  );
  if (personalized) {
    try {
      const parsed = JSON.parse(personalized) as { subject?: string; body?: string };
      if (parsed.subject && parsed.body) return { subject: parsed.subject, body: parsed.body };
    } catch {
      // fall through to template
    }
  }
  return fallback;
}

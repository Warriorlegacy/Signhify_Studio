import { createServerFn } from "@tanstack/react-start";

type GenerateInput = { prompt: string };

type PlanSection = { title: string; bullets: string[] };
export type GeneratedPlan = {
  productName: string;
  oneLiner: string;
  sections: PlanSection[];
  stack: string[];
};

function validate(input: unknown): GenerateInput {
  const obj = input as Record<string, unknown>;
  const prompt = typeof obj?.prompt === "string" ? obj.prompt.trim() : "";
  if (prompt.length < 4 || prompt.length > 1200) {
    throw new Error("Prompt must be between 4 and 1200 characters.");
  }
  return { prompt };
}

const SYSTEM = `You are Signhify AI, a six-agent product studio (Product Strategist, System Architect, UI/UX Designer, Frontend Engineer, Backend Engineer, Deployment).
Given a single product idea, return a concise build plan as STRICT JSON matching this TypeScript type:
{ "productName": string, "oneLiner": string, "sections": { "title": string, "bullets": string[] }[], "stack": string[] }
- 6 sections, one per agent, in the order listed above.
- 3 to 5 bullets per section, each <= 140 characters, no markdown.
- "stack" is a flat list of 5-8 technologies.
- Output ONLY the JSON object. No prose, no code fences.`;

export const generatePlan = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => validate(input))
  .handler(async ({ data }): Promise<GeneratedPlan> => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("Missing LOVABLE_API_KEY.");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "anthropic/claude-sonnet-4-5",
        temperature: 0.6,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: data.prompt },
        ],
      }),
    });

    if (res.status === 429) throw new Error("Rate limited. Please wait a moment and try again.");
    if (res.status === 402)
      throw new Error("Signhify AI credits exhausted. Email hello@signhify.online.");
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("[ai] gateway error", res.status, text);
      throw new Error("AI gateway error. Try again.");
    }

    const json = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = json.choices?.[0]?.message?.content ?? "";

    let parsed: GeneratedPlan;
    try {
      parsed = JSON.parse(content) as GeneratedPlan;
    } catch {
      throw new Error("AI returned an unexpected response. Try again.");
    }

    if (
      !parsed?.productName ||
      !parsed?.oneLiner ||
      !Array.isArray(parsed?.sections) ||
      !Array.isArray(parsed?.stack)
    ) {
      throw new Error("AI returned an incomplete plan. Try again.");
    }
    return parsed;
  });

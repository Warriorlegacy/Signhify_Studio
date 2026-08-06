import { env, llmAvailable } from "../lib/env";

const RULES: Array<{ re: RegExp; category: string; suggestion: string }> = [
  { re: /unsubscribe|remove me|stop emailing/i, category: "unsub", suggestion: "Removed from our list — apologies for the noise." },
  { re: /\b(no thanks|not interested|don't contact|stop|leave me alone)\b/i, category: "negative", suggestion: "Understood — I'll keep you off our list. Thanks for the reply." },
  { re: /\b(out of office|OOO|vacation|away until)\b/i, category: "ooo", suggestion: "" },
  { re: /\b(interested|tell me more|let's talk|schedule|book|call|quote|pricing|cost|budget|sounds good|yes)\b/i, category: "positive", suggestion: "Great — here's my booking link: <booking link>. What time works?" },
  { re: /\b(how much|what would it cost|pricing|estimate|rates)\b/i, category: "question", suggestion: "Happy to scope it — brief on the idea and I'll send a ballpark within a day." },
];

export async function classifyReply(text: string): Promise<{ category: string; suggestion: string }> {
  for (const rule of RULES) {
    if (rule.re.test(text)) return { category: rule.category, suggestion: rule.suggestion };
  }
  if (!llmAvailable() || !env.anthropicKey) return { category: "other", suggestion: "" };
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": env.anthropicKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 300,
        messages: [
          {
            role: "user",
            content: `Classify this cold-email reply. Reply with JSON: {"category":"positive|question|negative|unsub|ooo|other","suggestion":"short suggested reply string (empty if none)"}\n\nReply: ${text.slice(0, 2000)}`,
          },
        ],
      }),
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) return { category: "other", suggestion: "" };
    const data = (await res.json()) as { content: Array<{ type: string; text: string }> };
    const parsed = JSON.parse(data.content?.[0]?.text ?? "{}") as { category?: string; suggestion?: string };
    if (parsed.category) return { category: parsed.category, suggestion: parsed.suggestion ?? "" };
  } catch {
    // fall through
  }
  return { category: "other", suggestion: "" };
}

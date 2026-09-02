import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { generateAIResponseFor } from "./ai-gateway.server";
import { withByokKeys } from "./byok-middleware";

export type AssistantChatMessage = { role: "user" | "assistant"; content: string };
type ChatInput = { messages: AssistantChatMessage[] };

const SYSTEM = `You are Signhify Assistant, the built-in AI helper of the Signhify product studio.
You help users with software architecture, React/TypeScript code, full-stack blueprints, and product strategy.
Be concise, practical, and honest. Format code in fenced code blocks with the language tag.
If you do not know something, say so — never invent fake results.`;

function validate(input: unknown): ChatInput {
  const obj = input as Record<string, unknown>;
  const raw = Array.isArray(obj?.messages) ? obj.messages : [];
  const messages: AssistantChatMessage[] = [];
  for (const m of raw) {
    if (!m || typeof m !== "object") continue;
    const role = (m as { role?: unknown }).role;
    const content = (m as { content?: unknown }).content;
    if (typeof content !== "string") continue;
    messages.push({ role: role === "assistant" ? "assistant" : "user", content });
  }
  const trimmed = messages.slice(-20);
  if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
    throw new Error("A user message is required.");
  }
  if (messages.some((m) => m.content.length > 8000)) {
    throw new Error("Message is too long.");
  }
  return { messages };
}

export const assistantChat = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth, withByokKeys])
  .inputValidator((input: unknown) => validate(input))
  .handler(async ({ context, data }): Promise<{ content: string; providerUsed: string }> => {
    const { supabase, userId, claims } = context;
    const email = (claims as { email?: string | null } | undefined)?.email ?? null;
    const byokClientKeys = (context as { byokClientKeys?: Record<string, string> }).byokClientKeys;

    const { content, providerUsed } = await generateAIResponseFor(
      {
        messages: [{ role: "system", content: SYSTEM }, ...data.messages],
        temperature: 0.7,
      },
      { supabase, userId, email, byokClientKeys },
    );
    return { content, providerUsed };
  });

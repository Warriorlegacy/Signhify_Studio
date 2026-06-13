import { createServerFn } from "@tanstack/react-start";
import { generateAIResponse } from "./ai-gateway.server";

function extractHtml(text: string): string | null {
  const fence = text.match(/```(?:html)?\s*([\s\S]*?)```/i);
  if (fence && fence[1].includes("<")) return fence[1].trim();
  const doc = text.match(/<!doctype[\s\S]*?<\/html>/i);
  if (doc) return doc[0];
  const html = text.match(/<html[\s\S]*?<\/html>/i);
  if (html) return `<!doctype html>\n${html[0]}`;
  try {
    const parsed = JSON.parse(text);
    if (typeof parsed.html === "string" && parsed.html.includes("<")) return parsed.html;
  } catch {
    /* ignore */
  }
  return null;
}

const SYSTEM = `You are Signhify AI's builder. Output ONE self-contained HTML document that IS the working product MVP.

OUTPUT FORMAT — STRICT:
- Output the complete HTML starting with <!doctype html> and ending with </html>.
- NO prose before or after. NO markdown fences. NO JSON wrapper.

QUALITY BAR:
- Dark cinematic aesthetic by default: deep blacks (#0A0A0A), amber/orange accents (#FF6A00), glassy cards, gradient glows — UNLESS the user asks for another style.
- Inline <style> + inline <script>. Tailwind via CDN: <script src="https://cdn.tailwindcss.com"></script>.
- Google Fonts (Inter + Space Grotesk). Lucide icons from https://unpkg.com/lucide@latest if helpful.
- Build the ACTUAL working UI: real state, real interactivity, fake data where useful, working forms/buttons/lists.
- Responsive, accessible, semantic HTML. Keep under ~120KB.`;

export const buildProduct = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const obj = (input ?? {}) as Record<string, unknown>;
    const prompt = typeof obj.prompt === "string" ? obj.prompt.slice(0, 4000) : "";
    const planText = typeof obj.planText === "string" ? obj.planText.slice(0, 12000) : "";
    if (!prompt) throw new Error("Prompt required.");
    return { prompt, planText };
  })
  .handler(async ({ data }) => {
    const user = `Product prompt:\n${data.prompt}\n\n${data.planText ? `Plan / spec to implement:\n${data.planText}\n` : ""}Now output the complete standalone HTML for this product. Start with <!doctype html>.`;
    const content = await generateAIResponse({
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: user },
      ],
      temperature: 0.65,
      max_tokens: 8000,
    });
    const html = extractHtml(content);
    if (!html) throw new Error("AI returned no usable HTML. Try a more specific prompt.");
    return { html };
  });

export const editProduct = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const obj = (input ?? {}) as Record<string, unknown>;
    const currentHtml = typeof obj.currentHtml === "string" ? obj.currentHtml.slice(0, 150_000) : "";
    const instruction = typeof obj.instruction === "string" ? obj.instruction.slice(0, 4000) : "";
    if (!currentHtml || !instruction) throw new Error("currentHtml and instruction required.");
    return { currentHtml, instruction };
  })
  .handler(async ({ data }) => {
    const user = `Here is the CURRENT product HTML:\n\n${data.currentHtml}\n\n---\nUser change request:\n${data.instruction}\n\nReturn the COMPLETE updated HTML document (full file, not a diff). Preserve everything that wasn't asked to change. Start with <!doctype html>.`;
    const content = await generateAIResponse({
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: user },
      ],
      temperature: 0.45,
      max_tokens: 8000,
    });
    const html = extractHtml(content);
    if (!html) throw new Error("AI returned no usable HTML for the edit.");
    return { html };
  });

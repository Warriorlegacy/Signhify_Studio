import { createServerFn } from "@tanstack/react-start";
import { generateAIResponse } from "./ai-gateway.server";

export const buildProduct = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const obj = (input ?? {}) as Record<string, unknown>;
    const prompt = typeof obj.prompt === "string" ? obj.prompt.slice(0, 4000) : "";
    const planText = typeof obj.planText === "string" ? obj.planText.slice(0, 12000) : "";
    if (!prompt) throw new Error("Prompt required.");
    return { prompt, planText };
  })
  .handler(async ({ data }) => {
    const SYSTEM = `You are Signhify AI's code generator. Output a SINGLE self-contained HTML document (the full product MVP) implementing the user's request.

STRICT RULES:
1. Return ONLY a JSON object: {"html":"<!doctype html>...</html>","summary":"one short sentence"}.
2. No markdown fences, no commentary outside JSON.
3. The HTML must be a complete, runnable, beautiful, production-quality single-file app:
   - Inline <style> using a modern dark cinematic aesthetic (deep blacks, orange/amber #FF6A00 accents, glassy cards, gradient glows, smooth motion).
   - Inline <script> with interactivity, state, fake data where needed.
   - Use Tailwind via CDN: <script src="https://cdn.tailwindcss.com"></script>.
   - Use Google Fonts (Inter + Space Grotesk) via <link>.
   - Use lucide icons via https://unpkg.com/lucide@latest if needed.
   - Responsive, accessible, semantic.
4. Build the ACTUAL working product UI (dashboards, forms, lists, flows) — not a marketing page — unless the prompt is a landing page.
5. Keep total size under ~60KB.`;

    const user = `User prompt:
${data.prompt}

Plan context (use it as the spec):
${data.planText || "(no plan provided — infer from prompt)"}

Now output the JSON with the full standalone HTML product.`;

    const content = await generateAIResponse({
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: user },
      ],
      temperature: 0.6,
      response_format: { type: "json_object" },
      max_tokens: 8000,
    });

    try {
      const parsed = JSON.parse(content);
      if (typeof parsed.html !== "string" || !parsed.html.includes("<")) {
        throw new Error("Invalid HTML in response");
      }
      return { html: parsed.html as string, summary: (parsed.summary as string) ?? "" };
    } catch (e) {
      // Try to salvage: maybe the model returned raw HTML
      if (content.trim().startsWith("<")) {
        return { html: content, summary: "" };
      }
      throw new Error("Could not parse generated product.");
    }
  });

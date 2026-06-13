import { createServerFn } from "@tanstack/react-start";

// This is the AI endpoint for Scroll Studio Chat
export const scrollStudioChat = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const obj = input as Record<string, unknown>;
    const projectId = typeof obj?.projectId === "string" ? obj.projectId : null;
    const message = typeof obj?.message === "string" ? obj.message : "";
    return { projectId, message };
  })
  .handler(async ({ data }) => {
    const { projectId, message } = data;
    const apiKey = process.env.LOVABLE_API_KEY || process.env.OPENROUTER_API_KEY || process.env.GROQ_API_KEY;

    if (!apiKey) {
      // Mock response if no API keys
      return {
        message: "This is a mock response. Please add an API key (LOVABLE_API_KEY, OPENROUTER_API_KEY, etc.) to .env to enable Claude 4.5 Sonnet / LLMs.",
        code: "<h1>Cinematic Hero</h1>",
      };
    }

    const SYSTEM = `You are the Signhify Scroll Studio AI, an expert web developer specializing in cinematic, 3D-feeling websites.
Your output must be a JSON object matching this schema:
{
  "message": "A brief explanation of what you did",
  "html": "The updated HTML code",
  "css": "The updated CSS code",
  "js": "The updated JS code"
}
Output ONLY JSON. Do not include markdown fences.`;

    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "anthropic/claude-3.5-sonnet",
          temperature: 0.7,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: SYSTEM },
            { role: "user", content: message },
          ],
        }),
      });

      if (!res.ok) throw new Error("AI gateway error.");

      const json = await res.json();
      const content = json.choices?.[0]?.message?.content ?? "";
      
      try {
        const parsed = JSON.parse(content);
        return parsed;
      } catch {
        return { message: "I made some changes, but couldn't parse the code correctly." };
      }
    } catch (e) {
      console.error(e);
      return { message: "Error communicating with AI. Try again." };
    }
  });
import { createServerFn } from "@tanstack/react-start";
import { generateAIResponse, type Message } from "./ai-gateway.server";

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
      const content = await generateAIResponse({
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: message },
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      });

      try {
        const parsed = JSON.parse(content);
        return parsed;
      } catch (parseError) {
        console.error("[scrollStudioChat] JSON Parse Error:", parseError, content);
        return { message: "I generated a response, but it was not in the expected format. Please try again." };
      }
    } catch (e) {
      console.error("[scrollStudioChat] AI Gateway Error:", e);
      return { 
        message: "All available AI models are currently overloaded. Please add more API keys to .env (GROQ_API_KEY, CEREBRAS_API_KEY, etc.) or try again later." 
      };
    }
  });
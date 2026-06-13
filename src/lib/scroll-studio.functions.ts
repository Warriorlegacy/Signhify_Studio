import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { generateAIResponse, type Message } from "./ai-gateway.server";

// This is the AI endpoint for Scroll Studio Chat
export const scrollStudioChat = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    const obj = input as Record<string, unknown>;
    const projectId = typeof obj?.projectId === "string" ? obj.projectId : null;
    const message = typeof obj?.message === "string" ? obj.message : "";
    return { projectId, message };
  })
  .handler(async ({ data }) => {
    const { projectId, message } = data;

    const SYSTEM = `You are the Signhify Scroll Studio AI, an expert web developer specializing in cinematic, 3D-feeling websites driven by scroll interactions.

CRITICAL INSTRUCTIONS:
1. You must return ONLY a JSON object matching this schema:
{
  "message": "A brief explanation of what you did",
  "html": "The HTML code",
  "css": "The CSS code",
  "js": "The JavaScript code"
}
2. Never use markdown fences for the outer response. Return pure JSON.
3. INJECT THE SCROLL ENGINE: The generated code MUST include GSAP and ScrollTrigger.
4. Your HTML should include a <canvas id="hero-lightpass" /> fixed to the background.
5. Your CSS should style the canvas to cover the screen (object-fit: cover, position: fixed, z-index: -1).
6. Your JS MUST include this exact logic to render a cinematic image sequence on scroll:
   - Import GSAP via CDN (e.g. https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js and ScrollTrigger.min.js) in the HTML <head>.
   - Create an array of image URLs (use mock placeholders like 'https://picsum.photos/1280/720?random=1' to 60 for frames).
   - Use ScrollTrigger to scrub through the image sequence array and render it to the canvas context based on scroll position.
7. Overlay beautiful, minimalist typography and sections on top of the canvas (z-index: 10) to create a premium landing page feel.

Always output high-quality, production-ready, beautiful designs.`;

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
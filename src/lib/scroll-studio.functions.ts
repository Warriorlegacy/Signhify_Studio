import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { generateAIResponseFor, type Message } from "./ai-gateway.server";
import { BYOKRequiredError } from "./ai-access.server";
import { rateLimitMiddleware } from "./rate-limit.server";
import { withByokKeys } from "./byok-middleware";

// Models sometimes wrap JSON in markdown fences or add prose around it.
// Recover the JSON object instead of failing the whole build request.
function parseStudioJson(raw: string) {
  const text = raw.trim();
  const candidates: string[] = [text];

  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) candidates.push(fenced[1].trim());

  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");
  if (first !== -1 && last > first) candidates.push(text.slice(first, last + 1));

  let lastError: unknown = null;
  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate);
      if (parsed && typeof parsed === "object") return parsed;
    } catch (e) {
      lastError = e;
    }
  }

  // Some models emit JS-object syntax with backtick template literals for the
  // code fields. Pull each field out by hand rather than losing the whole build.
  const fields: Record<string, string> = {};
  const fieldRe =
    /"(message|html|css|js)"\s*:\s*(?:`([\s\S]*?)`|"((?:\\.|[^"\\])*)")\s*(?=,\s*"|\s*\}|$)/g;
  for (const m of text.matchAll(fieldRe)) {
    const key = m[1]!;
    if (m[2] !== undefined) fields[key] = m[2];
    else if (m[3] !== undefined) {
      try {
        fields[key] = JSON.parse(`"${m[3]}"`);
      } catch {
        fields[key] = m[3];
      }
    }
  }
  if (fields["html"] || fields["message"]) return fields;

  throw lastError ?? new Error("Unparseable AI response");
}


// This is the AI endpoint for Scroll Studio Chat
export const scrollStudioChat = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth, withByokKeys])
  .inputValidator((input: unknown) => {
    const obj = input as Record<string, unknown>;
    const projectId = typeof obj?.projectId === "string" ? obj.projectId : null;
    const message = typeof obj?.message === "string" ? obj.message : "";
    return { projectId, message };
  })
  .handler(async ({ data, context }) => {
    const { projectId, message } = data;
    const { supabase, userId, claims } = context as {
      supabase: any;
      userId: string;
      claims?: { email?: string | null };
    };
    const email = claims?.email ?? null;
    const byokClientKeys = (context as { byokClientKeys?: Record<string, string> }).byokClientKeys;

    const SYSTEM = `You are the Signhify Scroll Studio AI, an expert web developer specializing in cinematic, 3D-feeling websites driven by scroll interactions.

CRITICAL INSTRUCTIONS:
1. You must return ONLY a JSON object matching this schema:
{
  "message": "A brief explanation of what you did",
  "html": "The HTML code",
  "css": "The CSS code",
  "js": "The JavaScript code"
}
2. Never use markdown fences for the outer response. Return pure JSON. Never use backticks or template literals for any value: every value must be a standard JSON double-quoted string with \n escapes for newlines.
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
      const { content } = await generateAIResponseFor(
        {
          messages: [
            { role: "system", content: SYSTEM },
            { role: "user", content: message },
          ],
          temperature: 0.7,
          response_format: { type: "json_object" },
        },
        { supabase, userId, email, byokClientKeys },
      );

      try {
        return parseStudioJson(content);
      } catch (parseError) {
        console.error("[scrollStudioChat] JSON Parse Error:", parseError, content.slice(0, 500));
        return {
          message:
            "I generated a response, but it was not in the expected format. Please try again.",
        };
      }

    } catch (e) {
      if (e instanceof BYOKRequiredError || (e as { code?: string })?.code === "BYOK_REQUIRED") {
        return {
          message:
            "Signhify AI requires a paid plan or your own API key. Add one in Settings → AI Keys, or upgrade at /pricing.",
          code: "BYOK_REQUIRED",
        };
      }
      console.error("[scrollStudioChat] AI Gateway Error:", e);
      return {
        message: "All available AI models are currently overloaded. Please try again later.",
      };
    }
  });

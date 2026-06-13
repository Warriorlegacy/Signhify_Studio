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

function extractJson(text: string): any {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    /* ignore */
  }
  const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) {
    try {
      return JSON.parse(fence[1]);
    } catch {
      /* ignore */
    }
  }
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start >= 0 && end > start) {
    try {
      return JSON.parse(trimmed.slice(start, end + 1));
    } catch {
      /* ignore */
    }
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

const MULTI_SYSTEM = `You are Signhify AI's multi-file builder. You output a small project as a STRICT JSON object.

OUTPUT FORMAT — STRICT:
- Output a single JSON object: { "files": [ { "path": "index.html", "content": "..." }, ... ] }.
- NO prose. NO markdown fences. NO comments.
- "index.html" is REQUIRED and must <link rel="stylesheet" href="styles.css"> and <script src="app.js" defer> (or modules) — never inline the contents of those sibling files.
- Always include: index.html, styles.css, app.js, README.md. Add more files only if useful (e.g. components/*.js).
- All paths relative, no leading slash, no "..".

QUALITY BAR:
- Same dark cinematic aesthetic. Tailwind CDN allowed in index.html.
- Real working interactivity in app.js. Semantic, accessible HTML. Keep total under ~200KB.`;

type FileEntry = { path: string; content: string };

function sanitizeFiles(input: unknown): FileEntry[] {
  if (!input || typeof input !== "object") return [];
  const arr = (input as any).files;
  if (!Array.isArray(arr)) return [];
  const out: FileEntry[] = [];
  for (const f of arr) {
    if (!f || typeof f !== "object") continue;
    const path = typeof f.path === "string" ? f.path.replace(/^\/+/, "").replace(/\.\.\//g, "") : "";
    const content = typeof f.content === "string" ? f.content : "";
    if (!path || path.length > 200) continue;
    out.push({ path, content: content.slice(0, 200_000) });
  }
  return out;
}

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

export const ejectProduct = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const obj = (input ?? {}) as Record<string, unknown>;
    const currentHtml = typeof obj.currentHtml === "string" ? obj.currentHtml.slice(0, 150_000) : "";
    if (!currentHtml) throw new Error("currentHtml required.");
    return { currentHtml };
  })
  .handler(async ({ data }) => {
    const user = `Split this single-file HTML into a clean multi-file project. Extract <style> into styles.css and <script> (non-CDN) into app.js. Keep Tailwind CDN <script> in index.html <head>. Add a short README.md.\n\nCURRENT HTML:\n${data.currentHtml}\n\nReturn ONLY the JSON object: { "files": [ {"path":"index.html","content":"..."}, {"path":"styles.css","content":"..."}, {"path":"app.js","content":"..."}, {"path":"README.md","content":"..."} ] }.`;
    const content = await generateAIResponse({
      messages: [
        { role: "system", content: MULTI_SYSTEM },
        { role: "user", content: user },
      ],
      temperature: 0.3,
      max_tokens: 8000,
      response_format: { type: "json_object" },
    });
    const parsed = extractJson(content);
    const files = sanitizeFiles(parsed);
    if (!files.find((f) => f.path === "index.html")) throw new Error("Eject failed: no index.html in output.");
    return { files };
  });

export const buildMultiProduct = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const obj = (input ?? {}) as Record<string, unknown>;
    const prompt = typeof obj.prompt === "string" ? obj.prompt.slice(0, 4000) : "";
    if (!prompt) throw new Error("Prompt required.");
    return { prompt };
  })
  .handler(async ({ data }) => {
    const user = `Product prompt:\n${data.prompt}\n\nOutput the multi-file project JSON now.`;
    const content = await generateAIResponse({
      messages: [
        { role: "system", content: MULTI_SYSTEM },
        { role: "user", content: user },
      ],
      temperature: 0.6,
      max_tokens: 8000,
      response_format: { type: "json_object" },
    });
    const parsed = extractJson(content);
    const files = sanitizeFiles(parsed);
    if (!files.find((f) => f.path === "index.html")) throw new Error("AI returned no index.html.");
    return { files };
  });

export const editFiles = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const obj = (input ?? {}) as Record<string, unknown>;
    const files = sanitizeFiles({ files: (obj as any).files });
    const instruction = typeof obj.instruction === "string" ? obj.instruction.slice(0, 4000) : "";
    if (files.length === 0 || !instruction) throw new Error("files and instruction required.");
    return { files, instruction };
  })
  .handler(async ({ data }) => {
    const dump = data.files
      .map((f) => `=== ${f.path} ===\n${f.content}`)
      .join("\n\n");
    const user = `Here is the CURRENT multi-file project:\n\n${dump}\n\n---\nUser change request:\n${data.instruction}\n\nReturn the COMPLETE updated project as JSON: { "files": [...] }. Include EVERY file (changed or not). No diffs.`;
    const content = await generateAIResponse({
      messages: [
        { role: "system", content: MULTI_SYSTEM },
        { role: "user", content: user },
      ],
      temperature: 0.4,
      max_tokens: 8000,
      response_format: { type: "json_object" },
    });
    const parsed = extractJson(content);
    const files = sanitizeFiles(parsed);
    if (!files.find((f) => f.path === "index.html")) throw new Error("Edit failed: no index.html in output.");
    return { files };
  });

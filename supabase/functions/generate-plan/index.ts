import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

type Stage = "briefing" | "architecture" | "design_tokens" | "codegen" | "review" | "deploy_plan";
const STAGES: Stage[] = [
  "briefing",
  "architecture",
  "design_tokens",
  "codegen",
  "review",
  "deploy_plan",
];
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function ipFrom(req: Request) {
  return (
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}
function currentWindow() {
  const d = new Date();
  d.setUTCMinutes(0, 0, 0);
  return d.toISOString();
}
function sse(payload: unknown) {
  return `data: ${JSON.stringify(payload)}\n\n`;
}
function stageFromText(text: string, current: Stage): Stage {
  const lower = text.toLowerCase();
  for (const stage of STAGES)
    if (lower.includes(`[${stage}]`) || lower.includes(stage.replace("_", " "))) return stage;
  return current;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST")
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "content-type": "application/json" },
    });
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");
  if (!anthropicKey)
    return new Response(JSON.stringify({ error: "Missing ANTHROPIC_API_KEY" }), {
      status: 500,
      headers: { ...corsHeaders, "content-type": "application/json" },
    });
  const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
  const { prompt } = await req.json().catch(() => ({ prompt: "" }));
  if (typeof prompt !== "string" || prompt.trim().length < 3)
    return new Response(JSON.stringify({ error: "Prompt is required" }), {
      status: 400,
      headers: { ...corsHeaders, "content-type": "application/json" },
    });

  const ip = ipFrom(req);
  const windowStart = currentWindow();
  const { data: existing } = await supabase
    .from("rate_limits")
    .select("count")
    .eq("ip", ip)
    .eq("window_start", windowStart)
    .maybeSingle();
  if ((existing?.count ?? 0) >= 10)
    return new Response(JSON.stringify({ error: "Rate limit exceeded. Try again later." }), {
      status: 429,
      headers: { ...corsHeaders, "content-type": "application/json" },
    });
  await supabase
    .from("rate_limits")
    .upsert({ ip, window_start: windowStart, count: (existing?.count ?? 0) + 1 });

  const body = {
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 2400,
    stream: true,
    system: `You are Signhify AI. Stream a product plan in six labeled sections exactly in this order: [briefing], [architecture], [design_tokens], [codegen], [review], [deploy_plan]. Keep each section practical and concise.`,
    messages: [{ role: "user", content: prompt.trim() }],
  };
  const anth = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": anthropicKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(body),
  });
  if (!anth.ok || !anth.body)
    return new Response(JSON.stringify({ error: "Anthropic request failed" }), {
      status: anth.status || 502,
      headers: { ...corsHeaders, "content-type": "application/json" },
    });

  let stage: Stage = "briefing";
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";
  const stream = new ReadableStream({
    async start(controller) {
      const reader = anth.body!.getReader();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split("\n\n");
          buffer = parts.pop() ?? "";
          for (const part of parts) {
            const dataLine = part.split("\n").find((l) => l.startsWith("data:"));
            if (!dataLine || dataLine.includes("[DONE]")) continue;
            const json = JSON.parse(dataLine.slice(5).trim());
            const delta = json?.delta?.text;
            if (typeof delta === "string" && delta) {
              stage = stageFromText(delta, stage);
              controller.enqueue(encoder.encode(sse({ stage, delta })));
            }
          }
        }
        controller.enqueue(encoder.encode(sse({ stage, delta: "" })));
      } catch (error) {
        controller.enqueue(
          encoder.encode(
            sse({
              stage,
              delta: `\n[stream_error] ${error instanceof Error ? error.message : "Unknown error"}`,
            }),
          ),
        );
      } finally {
        controller.close();
      }
    },
  });
  return new Response(stream, {
    headers: {
      ...corsHeaders,
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-cache, no-transform",
      connection: "keep-alive",
    },
  });
});

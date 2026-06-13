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

type Provider = {
  name: string;
  url: string;
  model: string;
  apiKey?: string;
  extraHeaders?: Record<string, string>;
  isAnthropic?: boolean;
};

function buildProviders(): Provider[] {
  const env = (k: string) => Deno.env.get(k) || undefined;
  const all: Provider[] = [
    {
      name: "LovableAI",
      url: "https://ai.gateway.lovable.dev/v1/chat/completions",
      model: "google/gemini-3-flash-preview",
      apiKey: env("LOVABLE_API_KEY"),
      extraHeaders: { "Lovable-API-Key": env("LOVABLE_API_KEY") || "" },
    },
    {
      name: "Groq",
      url: "https://api.groq.com/openai/v1/chat/completions",
      model: "llama-3.3-70b-versatile",
      apiKey: env("GROQ_API_KEY"),
    },
    {
      name: "Cerebras",
      url: "https://api.cerebras.ai/v1/chat/completions",
      model: "llama-3.3-70b",
      apiKey: env("CEREBRAS_API_KEY"),
    },
    {
      name: "NVIDIA",
      url: "https://integrate.api.nvidia.com/v1/chat/completions",
      model: "nvidia/llama-3.3-nemotron-super-49b-v1",
      apiKey: env("NVIDIA_API_KEY"),
    },
    {
      name: "OpenRouter",
      url: "https://openrouter.ai/api/v1/chat/completions",
      model: "deepseek/deepseek-chat-v3.1:free",
      apiKey: env("OPENROUTER_API_KEY"),
      extraHeaders: {
        "HTTP-Referer": "https://signhify.lovable.app",
        "X-Title": "Signhify",
      },
    },
    {
      name: "Gemini",
      url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
      model: "gemini-2.0-flash",
      apiKey: env("GEMINI_API_KEY"),
    },
    {
      name: "Ollama",
      url: "https://ollama.com/v1/chat/completions",
      model: "gpt-oss:120b",
      apiKey: env("OLLAMA_API_KEY"),
    },
    {
      name: "Mistral",
      url: "https://api.mistral.ai/v1/chat/completions",
      model: "mistral-small-latest",
      apiKey: env("MISTRAL_API_KEY"),
    },
    {
      name: "Cohere",
      url: "https://api.cohere.ai/compatibility/v1/chat/completions",
      model: "command-r-plus",
      apiKey: env("COHERE_API_KEY"),
    },
    {
      name: "xAI",
      url: "https://api.x.ai/v1/chat/completions",
      model: "grok-2-latest",
      apiKey: env("XAI_API_KEY"),
    },
    {
      name: "Anthropic",
      url: "https://api.anthropic.com/v1/messages",
      model: "claude-3-5-sonnet-20241022",
      apiKey: env("ANTHROPIC_API_KEY"),
      isAnthropic: true,
    },
  ];
  return all.filter((p) => !!p.apiKey);
}

async function openProviderStream(p: Provider, systemPrompt: string, prompt: string) {
  const headers: Record<string, string> = { "content-type": "application/json" };
  let body: Record<string, unknown>;
  if (p.isAnthropic) {
    headers["x-api-key"] = p.apiKey!;
    headers["anthropic-version"] = "2023-06-01";
    body = {
      model: p.model,
      max_tokens: 2400,
      stream: true,
      system: systemPrompt,
      messages: [{ role: "user", content: prompt }],
    };
  } else {
    headers["Authorization"] = `Bearer ${p.apiKey}`;
    if (p.extraHeaders) Object.assign(headers, p.extraHeaders);
    body = {
      model: p.model,
      max_tokens: 2400,
      stream: true,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
    };
  }
  const res = await fetch(p.url, { method: "POST", headers, body: JSON.stringify(body) });
  return res;
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
  const providers = buildProviders();

  if (providers.length === 0) {
    return new Response(
      JSON.stringify({ error: "No AI API keys configured." }),
      { status: 500, headers: { ...corsHeaders, "content-type": "application/json" } },
    );
  }

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

  const systemPrompt = `You are Signhify AI. Stream a product plan in six labeled sections exactly in this order: [briefing], [architecture], [design_tokens], [codegen], [review], [deploy_plan]. Keep each section practical and concise.`;

  // Try each provider until one opens a usable stream (status OK and body present).
  let activeRes: Response | null = null;
  let activeProvider: Provider | null = null;
  const attempts: string[] = [];
  for (const p of providers) {
    try {
      const res = await openProviderStream(p, systemPrompt, prompt.trim());
      if (res.ok && res.body) {
        activeRes = res;
        activeProvider = p;
        attempts.push(`${p.name}:ok`);
        break;
      }
      attempts.push(`${p.name}:${res.status}`);
      try { await res.body?.cancel(); } catch { /* ignore */ }
    } catch (e) {
      attempts.push(`${p.name}:err`);
    }
  }

  if (!activeRes || !activeProvider) {
    return new Response(
      JSON.stringify({ error: `All AI providers failed: ${attempts.join(", ")}` }),
      { status: 502, headers: { ...corsHeaders, "content-type": "application/json" } },
    );
  }

  const isAnthropic = !!activeProvider.isAnthropic;
  let stage: Stage = "briefing";
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";
  const stream = new ReadableStream({
    async start(controller) {
      // Emit a meta event so the client knows which provider answered.
      controller.enqueue(
        encoder.encode(sse({ stage, delta: "", provider: activeProvider!.name })),
      );
      const reader = activeRes!.body!.getReader();
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
            try {
              const json = JSON.parse(dataLine.slice(5).trim());
              const delta = isAnthropic ? json?.delta?.text : json?.choices?.[0]?.delta?.content;
              if (typeof delta === "string" && delta) {
                stage = stageFromText(delta, stage);
                controller.enqueue(encoder.encode(sse({ stage, delta })));
              }
            } catch {
              // ignore non-JSON heartbeat lines
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
      "x-signhify-provider": activeProvider.name,
      "x-signhify-attempts": attempts.join(","),
    },
  });
});

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

// Robust AI Service Implementation for Deno
type Provider = {
  name: string;
  url: string;
  model: string;
  apiKey?: string;
  extraHeaders?: Record<string, string>;
  isAnthropic?: boolean;
  priority: number;
  enabled: boolean;
  failureCount: number;
  lastFailureTime: number | null;
  cooldownPeriod: number;
};

class RobustAIServiceDeno {
  private providers: Provider[] = [];
  private readonly maxFailuresBeforeCooldown = 3;
  private readonly defaultCooldownPeriod = 5 * 60 * 1000; // 5 minutes
  private readonly healthCheckInterval = 30 * 60 * 1000; // 30 minutes
  private healthCheckTimer: number | null = null;

  constructor() {
    this.initializeProviders();
    // Note: In Deno deploy, we might not want to set up intervals
    // For now, we'll skip the health check timer in edge functions
  }

  private initializeProviders() {
    const env = (k: string) => Deno.env.get(k) || undefined;

    // Define all available providers with their priorities
    const allProviders: Provider[] = [
      // 0. Lovable AI Gateway (auto-provisioned, billed via workspace credits) — most reliable
      {
        name: "LovableAI",
        url: "https://ai.gateway.lovable.dev/v1/chat/completions",
        model: "google/gemini-3-flash-preview",
        apiKey: env("LOVABLE_API_KEY"),
        extraHeaders: { "Lovable-API-Key": env("LOVABLE_API_KEY") || "" },
        isAnthropic: false,
        priority: 1,
        enabled: !!env("LOVABLE_API_KEY"),
        failureCount: 0,
        lastFailureTime: null,
        cooldownPeriod: this.defaultCooldownPeriod
      },
      // 1. Groq — fastest free Llama 3.3 70B
      {
        name: "Groq",
        url: "https://api.groq.com/openai/v1/chat/completions",
        model: "llama-3.3-70b-versatile",
        apiKey: env("GROQ_API_KEY"),
        isAnthropic: false,
        priority: 2,
        enabled: !!env("GROQ_API_KEY"),
        failureCount: 0,
        lastFailureTime: null,
        cooldownPeriod: this.defaultCooldownPeriod
      },
      // 2. Cerebras — wafer-scale Llama 3.3 70B
      {
        name: "Cerebras",
        url: "https://api.cerebras.ai/v1/chat/completions",
        model: "llama-3.3-70b",
        apiKey: env("CEREBRAS_API_KEY"),
        isAnthropic: false,
        priority: 3,
        enabled: !!env("CEREBRAS_API_KEY"),
        failureCount: 0,
        lastFailureTime: null,
        cooldownPeriod: this.defaultCooldownPeriod
      },
      // 3. NVIDIA NIM — free hosted Nemotron 49B
      {
        name: "NVIDIA",
        url: "https://integrate.api.nvidia.com/v1/chat/completions",
        model: "nvidia/llama-3.3-nemotron-super-49b-v1",
        apiKey: env("NVIDIA_API_KEY"),
        isAnthropic: false,
        priority: 4,
        enabled: !!env("NVIDIA_API_KEY"),
        failureCount: 0,
        lastFailureTime: null,
        cooldownPeriod: this.defaultCooldownPeriod
      },
      // 4. OpenRouter — best free model (DeepSeek V3.1)
      {
        name: "OpenRouter",
        url: "https://openrouter.ai/api/v1/chat/completions",
        model: "deepseek/deepseek-chat-v3.1:free",
        apiKey: env("OPENROUTER_API_KEY"),
        extraHeaders: {
          "HTTP-Referer": "https://signhify.lovable.app",
          "X-Title": "Signhify",
        },
        isAnthropic: false,
        priority: 5,
        enabled: !!env("OPENROUTER_API_KEY"),
        failureCount: 0,
        lastFailureTime: null,
        cooldownPeriod: this.defaultCooldownPeriod
      },
      // 5. Google Gemini — generous free tier
      {
        name: "Gemini",
        url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
        model: "gemini-2.0-flash",
        apiKey: env("GEMINI_API_KEY"),
        isAnthropic: false,
        priority: 6,
        enabled: !!env("GEMINI_API_KEY"),
        failureCount: 0,
        lastFailureTime: null,
        cooldownPeriod: this.defaultCooldownPeriod
      },
      // 6. Ollama Turbo — gpt-oss 120B hosted
      {
        name: "Ollama",
        url: "https://ollama.com/v1/chat/completions",
        model: "gpt-oss:120b",
        apiKey: env("OLLAMA_API_KEY"),
        isAnthropic: false,
        priority: 7,
        enabled: !!env("OLLAMA_API_KEY"),
        failureCount: 0,
        lastFailureTime: null,
        cooldownPeriod: this.defaultCooldownPeriod
      },
      // 7. Mistral — free tier small
      {
        name: "Mistral",
        url: "https://api.mistral.ai/v1/chat/completions",
        model: "mistral-small-latest",
        apiKey: env("MISTRAL_API_KEY"),
        isAnthropic: false,
        priority: 8,
        enabled: !!env("MISTRAL_API_KEY"),
        failureCount: 0,
        lastFailureTime: null,
        cooldownPeriod: this.defaultCooldownPeriod
      },
      // 8. Cohere — Command R+ via OpenAI-compatible endpoint
      {
        name: "Cohere",
        url: "https://api.cohere.ai/compatibility/v1/chat/completions",
        model: "command-r-plus",
        apiKey: env("COHERE_API_KEY"),
        isAnthropic: false,
        priority: 9,
        enabled: !!env("COHERE_API_KEY"),
        failureCount: 0,
        lastFailureTime: null,
        cooldownPeriod: this.defaultCooldownPeriod
      },
      // 9. xAI Grok — last resort
      {
        name: "xAI",
        url: "https://api.x.ai/v1/chat/completions",
        model: "grok-2-latest",
        apiKey: env("XAI_API_KEY"),
        isAnthropic: false,
        priority: 10,
        enabled: !!env("XAI_API_KEY"),
        failureCount: 0,
        lastFailureTime: null,
        cooldownPeriod: this.defaultCooldownPeriod
      },
      // 10. Anthropic Claude (if available)
      {
        name: "Anthropic",
        url: "https://api.anthropic.com/v1/messages",
        model: "claude-3-5-sonnet-20241022",
        apiKey: env("ANTHROPIC_API_KEY"),
        isAnthropic: true,
        priority: 11,
        enabled: !!env("ANTHROPIC_API_KEY"),
        failureCount: 0,
        lastFailureTime: null,
        cooldownPeriod: this.defaultCooldownPeriod
      }
    ];

    // Filter enabled providers and sort by priority
    this.providers = allProviders
      .filter(provider => provider.enabled)
      .sort((a, b) => a.priority - b.priority);

    console.log(`[RobustAIServiceDeno] Initialized ${this.providers.length} AI providers`);
  }

  private buildProviderHeaders(provider: Provider): HeadersInit {
    const headers: HeadersInit = { "content-type": "application/json" };

    if (provider.isAnthropic) {
      headers["x-api-key"] = provider.apiKey!;
      headers["anthropic-version"] = "2023-06-01";
    } else {
      headers["Authorization"] = `Bearer ${provider.apiKey}`;
      if (provider.extraHeaders) {
        Object.assign(headers, provider.extraHeaders);
      }
    }

    return headers;
  }

  private buildRequestBody(provider: Provider, systemPrompt: string, prompt: string): unknown {
    if (provider.isAnthropic) {
      return {
        model: provider.model,
        max_tokens: 2400,
        stream: true,
        system: systemPrompt,
        messages: [{ role: "user", content: prompt }],
      };
    } else {
      return {
        model: provider.model,
        max_tokens: 2400,
        stream: true,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
      };
    }
  }

  private recordFailure(provider: Provider) {
    provider.failureCount++;
    provider.lastFailureTime = Date.now();

    // Disable provider if it has too many failures
    if (provider.failureCount >= this.maxFailuresBeforeCooldown) {
      provider.enabled = false;
      console.warn(`[RobustAIServiceDeno] Provider ${provider.name} disabled after ${provider.failureCount} failures`);
    } else {
      console.warn(`[RobustAIServiceDeno] Provider ${provider.name} failure ${provider.failureCount}/${this.maxFailuresBeforeCooldown}`);
    }
  }

  private recordSuccess(provider: Provider) {
    // Reset failure count on success
    if (provider.failureCount > 0) {
      console.log(`[RobustAIServiceDeno] Provider ${provider.name} recovered, resetting failure count`);
      provider.failureCount = 0;
      provider.lastFailureTime = null;
    }
  }

  async openProviderStream(p: Provider, systemPrompt: string, prompt: string): Promise<Response> {
    try {
      console.log(`[RobustAIServiceDeno] Attempting generation with ${p.name} (${p.model})...`);

      const res = await fetch(p.url, {
        method: "POST",
        headers: this.buildProviderHeaders(p),
        body: JSON.stringify(this.buildRequestBody(p, systemPrompt, prompt)),
      });

      if (!res.ok) {
        const errorData = await res.text().catch(() => "Unknown error");
        console.warn(`[RobustAIServiceDeno] ${p.name} failed (${res.status}): ${errorData}`);

        // Record failure
        this.recordFailure(p);

        // If rate limited or server error, throw to try next provider
        if (res.status === 429 || res.status >= 500) {
          throw new Error(`${p.name} returned ${res.status}`);
        }

        throw new Error(`${p.name} error: ${errorData}`);
      }

      // Success! Record it and return the response
      this.recordSuccess(p);
      console.log(`[RobustAIServiceDeno] Successfully opened stream with ${p.name}`);
      return res;
    } catch (e) {
      console.warn(`[RobustAIServiceDeno] Exception with ${p.name}:`, e);
      this.recordFailure(p);
      throw e;
    }
  }
}

// Create a singleton instance
const robustAIServiceDeno = new RobustAIServiceDeno();

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST")
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "content-type": "application/json" },
    });

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  // Use our robust AI service to get the list of providers
  const providers = robustAIServiceDeno.providers;

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
      const res = await robustAIServiceDeno.openProviderStream(p, systemPrompt, prompt.trim());
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

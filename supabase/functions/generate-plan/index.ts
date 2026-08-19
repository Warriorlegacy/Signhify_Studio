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

const ADMIN_EMAILS = ["piyushrajsingh092@gmail.com", "rajpiyush092@gmail.com"];
function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.map((e) => e.toLowerCase()).includes(email.toLowerCase());
}

const PAID_PLANS = new Set(["studio", "scale", "pro"]);

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
  for (const stage of STAGES) {
    if (lower.includes(`[${stage}]`) || lower.includes(stage.replace("_", " "))) return stage;
  }
  return current;
}

// --------------------------------------------------------------------------
// WebCrypto AES-256-GCM Decryption (Zero-Knowledge BYOK)
// Matches secrets.server.ts and byok-client.ts: SHA-256 key hash, iv:tag:ct hex
// --------------------------------------------------------------------------

function hexToBytes(hex: string): Uint8Array {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return out;
}

async function importKey(keyHexOrString: string, usage: "encrypt" | "decrypt") {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(keyHexOrString));
  return crypto.subtle.importKey("raw", digest, { name: "AES-GCM" }, false, [usage]);
}

async function decryptAES256GCM(blob: string, keyHexOrString: string): Promise<string> {
  const [ivHex, tagHex, ctHex] = blob.split(":");
  if (!ivHex || !tagHex || !ctHex) throw new Error("Invalid ciphertext blob format");
  const key = await importKey(keyHexOrString, "decrypt");
  const data = new Uint8Array([...hexToBytes(ctHex), ...hexToBytes(tagHex)]);
  const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: hexToBytes(ivHex) }, key, data);
  return new TextDecoder().decode(plain);
}

// --------------------------------------------------------------------------
// Provider Definitions & Templates
// --------------------------------------------------------------------------

type Provider = {
  name: string;
  url: string;
  model: string;
  apiKey?: string;
  extraHeaders?: Record<string, string>;
  isAnthropic?: boolean;
  priority: number;
};

type ProviderTemplate = {
  name: string;
  url: string;
  model: string;
  isAnthropic?: boolean;
  priority: number;
  headers?: Record<string, string>;
};

const BYOK_TEMPLATES: ProviderTemplate[] = [
  {
    name: "OpenAI",
    url: "https://api.openai.com/v1/chat/completions",
    model: "gpt-4o-mini",
    priority: 1,
  },
  {
    name: "ChatGPT_Cookies",
    url: "https://api.openai.com/v1/chat/completions",
    model: "gpt-4o",
    priority: 1.5,
  },
  {
    name: "Gemini",
    url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
    model: "gemini-2.0-flash",
    priority: 2,
  },
  {
    name: "Gemini_Cookies",
    url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
    model: "gemini-2.0-flash",
    priority: 2.5,
  },
  {
    name: "Groq",
    url: "https://api.groq.com/openai/v1/chat/completions",
    model: "llama-3.3-70b-versatile",
    priority: 3,
  },
  {
    name: "Cerebras",
    url: "https://api.cerebras.ai/v1/chat/completions",
    model: "llama-3.3-70b",
    priority: 4,
  },
  {
    name: "NVIDIA",
    url: "https://integrate.api.nvidia.com/v1/chat/completions",
    model: "nvidia/llama-3.3-nemotron-super-49b-v1",
    priority: 5,
  },
  {
    name: "OpenRouter",
    url: "https://openrouter.ai/api/v1/chat/completions",
    model: "deepseek/deepseek-chat-v3.1:free",
    headers: { "HTTP-Referer": "https://signhify.com", "X-Title": "Signhify" },
    priority: 6,
  },
  {
    name: "Ollama",
    url: "https://ollama.com/v1/chat/completions",
    model: "gpt-oss:120b",
    priority: 7,
  },
  {
    name: "Mistral",
    url: "https://api.mistral.ai/v1/chat/completions",
    model: "mistral-small-latest",
    priority: 8,
  },
  {
    name: "Cohere",
    url: "https://api.cohere.ai/compatibility/v1/chat/completions",
    model: "command-r-plus",
    priority: 9,
  },
  {
    name: "xAI",
    url: "https://api.x.ai/v1/chat/completions",
    model: "grok-2-latest",
    priority: 10,
  },
  {
    name: "Anthropic",
    url: "https://api.anthropic.com/v1/messages",
    model: "claude-3-5-sonnet-20241022",
    isAnthropic: true,
    priority: 11,
  },
];

function getManagedProviders(): Provider[] {
  const env = (k: string) => Deno.env.get(k) || undefined;
  const list: Provider[] = [
    {
      name: "LovableAI",
      url: "https://ai.gateway.lovable.dev/v1/chat/completions",
      model: "google/gemini-3-flash-preview",
      apiKey: env("LOVABLE_API_KEY"),
      extraHeaders: { "Lovable-API-Key": env("LOVABLE_API_KEY") || "" },
      isAnthropic: false,
      priority: 1,
    },
    {
      name: "Groq",
      url: "https://api.groq.com/openai/v1/chat/completions",
      model: "llama-3.3-70b-versatile",
      apiKey: env("GROQ_API_KEY"),
      isAnthropic: false,
      priority: 2,
    },
    {
      name: "Cerebras",
      url: "https://api.cerebras.ai/v1/chat/completions",
      model: "llama-3.3-70b",
      apiKey: env("CEREBRAS_API_KEY"),
      isAnthropic: false,
      priority: 3,
    },
    {
      name: "NVIDIA",
      url: "https://integrate.api.nvidia.com/v1/chat/completions",
      model: "nvidia/llama-3.3-nemotron-super-49b-v1",
      apiKey: env("NVIDIA_API_KEY"),
      isAnthropic: false,
      priority: 4,
    },
    {
      name: "OpenRouter",
      url: "https://openrouter.ai/api/v1/chat/completions",
      model: "deepseek/deepseek-chat-v3.1:free",
      apiKey: env("OPENROUTER_API_KEY"),
      extraHeaders: {
        "HTTP-Referer": "https://signhify.com",
        "X-Title": "Signhify",
      },
      isAnthropic: false,
      priority: 5,
    },
    {
      name: "Gemini",
      url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
      model: "gemini-2.0-flash",
      apiKey: env("GEMINI_API_KEY"),
      isAnthropic: false,
      priority: 6,
    },
    {
      name: "Ollama",
      url: "https://ollama.com/v1/chat/completions",
      model: "gpt-oss:120b",
      apiKey: env("OLLAMA_API_KEY"),
      isAnthropic: false,
      priority: 7,
    },
    {
      name: "Mistral",
      url: "https://api.mistral.ai/v1/chat/completions",
      model: "mistral-small-latest",
      apiKey: env("MISTRAL_API_KEY"),
      isAnthropic: false,
      priority: 8,
    },
    {
      name: "Cohere",
      url: "https://api.cohere.ai/compatibility/v1/chat/completions",
      model: "command-r-plus",
      apiKey: env("COHERE_API_KEY"),
      isAnthropic: false,
      priority: 9,
    },
    {
      name: "xAI",
      url: "https://api.x.ai/v1/chat/completions",
      model: "grok-2-latest",
      apiKey: env("XAI_API_KEY"),
      isAnthropic: false,
      priority: 10,
    },
    {
      name: "Anthropic",
      url: "https://api.anthropic.com/v1/messages",
      model: "claude-3-5-sonnet-20241022",
      apiKey: env("ANTHROPIC_API_KEY"),
      isAnthropic: true,
      priority: 11,
    },
  ];
  return list.filter((p) => !!p.apiKey).sort((a, b) => a.priority - b.priority);
}

function buildByokProviders(
  userKeys: Record<string, string>,
  customEndpoints: Record<string, string>,
): Provider[] {
  const providers: Provider[] = [];
  for (const t of BYOK_TEMPLATES) {
    const key = userKeys[t.name];
    if (key) {
      providers.push({
        name: t.name,
        url: t.url,
        model: t.model,
        apiKey: key,
        extraHeaders: t.headers,
        isAnthropic: !!t.isAnthropic,
        priority: t.priority,
      });
    }
  }
  if (userKeys["Custom"] && customEndpoints["Custom"]) {
    let customUrl = customEndpoints["Custom"].trim();
    if (!customUrl.endsWith("/chat/completions")) {
      customUrl = customUrl.replace(/\/$/, "") + "/chat/completions";
    }
    providers.push({
      name: "Custom",
      url: customUrl,
      model: "custom-model",
      apiKey: userKeys["Custom"],
      isAnthropic: false,
      priority: 0,
    });
  }
  return providers.sort((a, b) => a.priority - b.priority);
}

function buildProviderHeaders(provider: Provider): HeadersInit {
  const headers: Record<string, string> = { "content-type": "application/json" };
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

function buildRequestBody(provider: Provider, systemPrompt: string, prompt: string): unknown {
  if (provider.isAnthropic) {
    return {
      model: provider.model,
      max_tokens: 2400,
      stream: true,
      system: systemPrompt,
      messages: [{ role: "user", content: prompt }],
    };
  }
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

async function openProviderStream(
  p: Provider,
  systemPrompt: string,
  prompt: string,
): Promise<Response> {
  console.log(`[generate-plan] Attempting stream with ${p.name} (${p.model})...`);
  const res = await fetch(p.url, {
    method: "POST",
    headers: buildProviderHeaders(p),
    body: JSON.stringify(buildRequestBody(p, systemPrompt, prompt)),
  });

  if (!res.ok) {
    const errorData = await res.text().catch(() => "Unknown error");
    console.warn(`[generate-plan] ${p.name} failed (${res.status}): ${errorData}`);
    throw new Error(`${p.name} returned ${res.status}: ${errorData}`);
  }

  return res;
}

// --------------------------------------------------------------------------
// HTTP Server
// --------------------------------------------------------------------------

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST")
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "content-type": "application/json" },
    });

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  if (!supabaseUrl || !serviceKey) {
    return new Response(JSON.stringify({ error: "Server configuration missing" }), {
      status: 500,
      headers: { ...corsHeaders, "content-type": "application/json" },
    });
  }

  const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

  // 1. Authenticate user from Authorization Bearer token
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (!token) {
    return new Response(
      JSON.stringify({ error: "Unauthorized: Missing authorization header" }),
      { status: 401, headers: { ...corsHeaders, "content-type": "application/json" } },
    );
  }

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser(token);

  if (userErr || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized: Invalid user session token" }), {
      status: 401,
      headers: { ...corsHeaders, "content-type": "application/json" },
    });
  }

  // 2. Parse request body
  const body = await req.json().catch(() => ({}));
  const prompt = typeof body?.prompt === "string" ? body.prompt : "";
  const clientKeys =
    body?.clientKeys && typeof body.clientKeys === "object"
      ? (body.clientKeys as Record<string, string>)
      : {};

  if (prompt.trim().length < 3) {
    return new Response(
      JSON.stringify({ error: "Prompt is required (min 3 characters)" }),
      { status: 400, headers: { ...corsHeaders, "content-type": "application/json" } },
    );
  }

  // 3. Rate limiting (per-user / IP)
  const ip = ipFrom(req);
  const rateKey = `${user.id}:${ip}`;
  const windowStart = currentWindow();
  const { data: existing } = await supabase
    .from("rate_limits")
    .select("count")
    .eq("ip", rateKey)
    .eq("window_start", windowStart)
    .maybeSingle();

  if ((existing?.count ?? 0) >= 30) {
    return new Response(
      JSON.stringify({ error: "Rate limit exceeded. Try again in a little while." }),
      { status: 429, headers: { ...corsHeaders, "content-type": "application/json" } },
    );
  }
  await supabase
    .from("rate_limits")
    .upsert({ ip: rateKey, window_start: windowStart, count: (existing?.count ?? 0) + 1 });

  // 4. Resolve AI access: Managed for Admins & Paid Plans; BYOK for Free Users
  let providers: Provider[] = [];

  const isAdmin = isAdminEmail(user.email);
  if (isAdmin) {
    providers = getManagedProviders();
  } else {
    const { data: prof } = await supabase
      .from("profiles")
      .select("subscription_plan, subscription_status")
      .eq("id", user.id)
      .maybeSingle();

    const plan = String(prof?.subscription_plan ?? "free").toLowerCase();
    const status = String(prof?.subscription_status ?? "").toLowerCase();
    const isPaid =
      PAID_PLANS.has(plan) && (status === "" || status === "active" || status === "trialing");

    if (isPaid) {
      providers = getManagedProviders();
    } else {
      // Free plan: Read BYOK keys from database and decrypt
      const { data: keyRows } = await supabase
        .from("user_ai_keys")
        .select("provider, api_key_encrypted, api_endpoint")
        .eq("user_id", user.id);

      const masterKey = Deno.env.get("SECRETS_MASTER_KEY");
      const userKeys: Record<string, string> = {};
      const customEndpoints: Record<string, string> = {};
      let decryptFailures = 0;

      for (const row of (keyRows ?? []) as Array<{
        provider: string;
        api_key_encrypted: string;
        api_endpoint?: string;
      }>) {
        if (!row?.api_key_encrypted) continue;
        const attempts = [
          ...(clientKeys[row.provider] ? [clientKeys[row.provider]] : []),
          ...(masterKey && masterKey.length >= 16 ? [masterKey] : []),
        ];
        let decrypted: string | null = null;
        for (const attempt of attempts) {
          try {
            decrypted = await decryptAES256GCM(row.api_key_encrypted, attempt);
            break;
          } catch {
            /* try next */
          }
        }
        if (decrypted === null) {
          decryptFailures += 1;
          continue;
        }
        userKeys[row.provider] = decrypted;
        if (row.provider === "Custom" && row.api_endpoint) {
          customEndpoints[row.provider] = row.api_endpoint;
        }
      }

      if (Object.keys(userKeys).length === 0) {
        if (decryptFailures > 0) {
          return new Response(
            JSON.stringify({
              error: "BYOK_DECRYPT_FAILED",
              message:
                "Your saved AI keys could not be decrypted. Please re-enter them in Settings → AI Keys.",
            }),
            { status: 403, headers: { ...corsHeaders, "content-type": "application/json" } },
          );
        }
        return new Response(
          JSON.stringify({
            error: "BYOK_REQUIRED",
            message:
              "Signhify AI is available on paid plans. Free users must add their own API key in Settings → AI Keys, or upgrade at /pricing.",
          }),
          { status: 402, headers: { ...corsHeaders, "content-type": "application/json" } },
        );
      }

      providers = buildByokProviders(userKeys, customEndpoints);
    }
  }

  if (providers.length === 0) {
    return new Response(
      JSON.stringify({
        error: "NO_PROVIDERS_AVAILABLE",
        message: "No AI provider keys are currently available. Please configure an API key.",
      }),
      { status: 500, headers: { ...corsHeaders, "content-type": "application/json" } },
    );
  }

  // 5. Stream execution with fallback across available providers
  const systemPrompt = `You are Signhify AI. Stream a product plan in six labeled sections exactly in this order: [briefing], [architecture], [design_tokens], [codegen], [review], [deploy_plan]. Keep each section practical and concise.`;

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
      try {
        await res.body?.cancel();
      } catch {
        /* ignore */
      }
    } catch (_e) {
      attempts.push(`${p.name}:err`);
    }
  }

  if (!activeRes || !activeProvider) {
    return new Response(
      JSON.stringify({
        error: `All AI providers failed: ${attempts.join(", ")}`,
        attempts,
      }),
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

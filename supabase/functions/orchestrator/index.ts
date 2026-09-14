import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type AgentName =
  | "product_strategist"
  | "system_architect"
  | "ui_ux_designer"
  | "frontend_engineer"
  | "backend_engineer"
  | "deployment_agent";

type AgentStatus = "pending" | "running" | "done" | "error" | "skipped";

type RunAgent = {
  id: string;
  run_id: string;
  name: AgentName;
  status: AgentStatus;
  started_at: string | null;
  finished_at: string | null;
  latency_ms: number | null;
  tokens_used: number;
  error: string | null;
  retries: number;
};

type Artifact = { path: string; content: string; language?: string };

type EventPayload =
  | { type: "transition"; agent: AgentName; status: AgentStatus }
  | { type: "log"; agent: AgentName; message: string }
  | { type: "artifact"; agent: AgentName; path: string; language?: string }
  | { type: "error"; agent: AgentName; message: string }
  | { type: "complete"; result: { runId: string; traceId: string } };

// ---------------------------------------------------------------------------
// Agent definitions
// ---------------------------------------------------------------------------

const AGENTS: { name: AgentName; label: string; timeoutMs: number; maxRetries: number }[] = [
  { name: "product_strategist", label: "Product Strategist", timeoutMs: 25_000, maxRetries: 2 },
  { name: "system_architect", label: "System Architect", timeoutMs: 25_000, maxRetries: 2 },
  { name: "ui_ux_designer", label: "UI/UX Designer", timeoutMs: 25_000, maxRetries: 2 },
  { name: "frontend_engineer", label: "Frontend Engineer", timeoutMs: 30_000, maxRetries: 2 },
  { name: "backend_engineer", label: "Backend Engineer", timeoutMs: 30_000, maxRetries: 2 },
  { name: "deployment_agent", label: "Deployment Agent", timeoutMs: 20_000, maxRetries: 1 },
];

// ---------------------------------------------------------------------------
// Provider fallback (simplified, mirrors generate-plan)
// ---------------------------------------------------------------------------

type Provider = {
  name: string;
  url: string;
  model: string;
  apiKey?: string;
  extraHeaders?: Record<string, string>;
  isAnthropic?: boolean;
  priority: number;
};

const MANAGED: Provider[] = [
  { name: "LovableAI", url: "https://ai.gateway.lovable.dev/v1/chat/completions", model: "google/gemini-3-flash-preview", apiKey: Deno.env.get("LOVABLE_API_KEY") || undefined, extraHeaders: { "Lovable-API-Key": Deno.env.get("LOVABLE_API_KEY") || "" }, priority: 1 },
  { name: "Groq", url: "https://api.groq.com/openai/v1/chat/completions", model: "llama-3.3-70b-versatile", apiKey: Deno.env.get("GROQ_API_KEY"), priority: 2 },
  { name: "Cerebras", url: "https://api.cerebras.ai/v1/chat/completions", model: "llama-3.3-70b", apiKey: Deno.env.get("CEREBRAS_API_KEY"), priority: 3 },
  { name: "NVIDIA", url: "https://integrate.api.nvidia.com/v1/chat/completions", model: "nvidia/llama-3.3-nemotron-super-49b-v1", apiKey: Deno.env.get("NVIDIA_API_KEY"), priority: 4 },
  { name: "OpenRouter", url: "https://openrouter.ai/api/v1/chat/completions", model: "deepseek/deepseek-chat-v3.1:free", apiKey: Deno.env.get("OPENROUTER_API_KEY"), extraHeaders: { "HTTP-Referer": "https://signhify.com", "X-Title": "Signhify" }, priority: 5 },
  { name: "Gemini", url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", model: "gemini-2.0-flash", apiKey: Deno.env.get("GEMINI_API_KEY"), priority: 6 },
  { name: "Ollama", url: "https://ollama.com/v1/chat/completions", model: "gpt-oss:120b", apiKey: Deno.env.get("OLLAMA_API_KEY"), priority: 7 },
  { name: "Mistral", url: "https://api.mistral.ai/v1/chat/completions", model: "mistral-small-latest", apiKey: Deno.env.get("MISTRAL_API_KEY"), priority: 8 },
  { name: "Cohere", url: "https://api.cohere.ai/compatibility/v1/chat/completions", model: "command-r-plus", apiKey: Deno.env.get("COHERE_API_KEY"), priority: 9 },
  { name: "xAI", url: "https://api.x.ai/v1/chat/completions", model: "grok-2-latest", apiKey: Deno.env.get("XAI_API_KEY"), priority: 10 },
  { name: "Anthropic", url: "https://api.anthropic.com/v1/messages", model: "claude-3-5-sonnet-20241022", apiKey: Deno.env.get("ANTHROPIC_API_KEY"), isAnthropic: true, priority: 11 },
].filter((p) => !!p.apiKey).sort((a, b) => a.priority - b.priority);

function buildHeaders(p: Provider): Record<string, string> {
  const h: Record<string, string> = { "content-type": "application/json" };
  if (p.isAnthropic) {
    h["x-api-key"] = p.apiKey!;
    h["anthropic-version"] = "2023-06-01";
  } else {
    h["Authorization"] = `Bearer ${p.apiKey}`;
    if (p.extraHeaders) Object.assign(h, p.extraHeaders);
  }
  return h;
}

async function callProvider(p: Provider, system: string, user: string, signal: AbortSignal): Promise<Response> {
  const res = await fetch(p.url, {
    method: "POST",
    headers: buildHeaders(p),
    body: JSON.stringify(p.isAnthropic
      ? { model: p.model, max_tokens: 2400, stream: false, system, messages: [{ role: "user", content: user }] }
      : { model: p.model, max_tokens: 2400, response_format: { type: "json_object" }, messages: [{ role: "system", content: system }, { role: "user", content: user }] }),
    signal,
  });
  if (!res.ok) throw new Error(`${p.name} ${res.status}`);
  return res;
}

async function runWithFallback(system: string, user: string, signal: AbortSignal): Promise<{ content: string; provider: string; tokens: number }> {
  const attempts: string[] = [];
  for (const p of MANAGED) {
    try {
      const res = await callProvider(p, system, user, signal);
      const data = await res.json();
      const content = p.isAnthropic
        ? (data as any).content?.[0]?.text ?? ""
        : (data as any).choices?.[0]?.message?.content ?? "";
      const tokens = (data as any).usage?.total_tokens ?? 0;
      if (!content) throw new Error("empty content");
      return { content, provider: p.name, tokens };
    } catch (e) {
      attempts.push(`${p.name}:${(e as Error).message}`);
    }
  }
  throw new Error(`All providers failed: ${attempts.join(", ")}`);
}

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

function assertJsonObject(text: string): unknown {
  const parsed = JSON.parse(text);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Expected JSON object");
  }
  return parsed;
}

function validateStrategistOutput(text: string): { productName: string; oneLiner: string; targetAudience: string; keyFeatures: string[] } {
  const obj = assertJsonObject(text) as any;
  if (typeof obj.productName !== "string" || typeof obj.oneLiner !== "string") {
    throw new Error("Missing productName or oneLiner");
  }
  if (!Array.isArray(obj.keyFeatures) || obj.keyFeatures.length < 3) {
    throw new Error("keyFeatures must be array with >= 3 items");
  }
  return {
    productName: obj.productName,
    oneLiner: obj.oneLiner,
    targetAudience: typeof obj.targetAudience === "string" ? obj.targetAudience : "",
    keyFeatures: obj.keyFeatures.slice(0, 8),
  };
}

function validateArchitectOutput(text: string): { supabaseMigration: string; typescriptTypes: string; apiRoutes: string[] } {
  const obj = assertJsonObject(text) as any;
  if (typeof obj.supabaseMigration !== "string" || !obj.supabaseMigration.includes("CREATE TABLE")) {
    throw new Error("Missing valid supabaseMigration");
  }
  if (typeof obj.typescriptTypes !== "string" || !obj.typescriptTypes.includes("export")) {
    throw new Error("Missing valid typescriptTypes");
  }
  return {
    supabaseMigration: obj.supabaseMigration,
    typescriptTypes: obj.typescriptTypes,
    apiRoutes: Array.isArray(obj.apiRoutes) ? obj.apiRoutes.slice(0, 6) : [],
  };
}

function validateDesignerOutput(text: string): { tailwindConfig: Record<string, unknown>; colorPalette: { primary: string; background: string; foreground: string; accent: string }; layoutSpec: Record<string, unknown> } {
  const obj = assertJsonObject(text) as any;
  if (typeof obj.tailwindConfig !== "object" || obj.tailwindConfig === null) throw new Error("Missing tailwindConfig");
  if (typeof obj.colorPalette?.primary !== "string") throw new Error("Missing colorPalette.primary");
  return {
    tailwindConfig: obj.tailwindConfig,
    colorPalette: obj.colorPalette,
    layoutSpec: typeof obj.layoutSpec === "object" ? obj.layoutSpec : {},
  };
}

function validateFrontendOutput(text: string): Artifact[] {
  const obj = assertJsonObject(text) as any;
  if (!Array.isArray(obj.files) || obj.files.length === 0) throw new Error("files array required");
  const out: Artifact[] = [];
  for (const f of obj.files) {
    const path = typeof f.path === "string" ? f.path.replace(/^\/+/, "").replace(/\.\.\//g, "") : "";
    const content = typeof f.content === "string" ? f.content : "";
    if (!path || !content) continue;
    if (!/\.(tsx?|jsx?|css|json|md)$/.test(path) && !path.endsWith(".ts") && !path.endsWith(".js")) continue;
    out.push({ path, content, language: path.split(".").pop() });
  }
  if (out.length === 0) throw new Error("No valid files produced");
  return out;
}

function validateBackendOutput(text: string): Artifact[] {
  const obj = assertJsonObject(text) as any;
  if (!Array.isArray(obj.files) || obj.files.length === 0) throw new Error("files array required");
  const out: Artifact[] = [];
  for (const f of obj.files) {
    const path = typeof f.path === "string" ? f.path.replace(/^\/+/, "").replace(/\.\.\//g, "") : "";
    const content = typeof f.content === "string" ? f.content : "";
    if (!path || !content) continue;
    if (!/\.(ts|js|json|sql|md)$/.test(path)) continue;
    out.push({ path, content, language: path.split(".").pop() });
  }
  if (out.length === 0) throw new Error("No valid files produced");
  return out;
}

function validateDeploymentOutput(text: string): Artifact[] {
  const obj = assertJsonObject(text) as any;
  const out: Artifact[] = [];
  const add = (path: string, content: string) => {
    const p = path.replace(/^\/+/, "").replace(/\.\.\//g, "");
    if (p && content) out.push({ path: p, content, language: p.split(".").pop() });
  };
  if (typeof obj.vercelConfig === "string") add("vercel.json", obj.vercelConfig);
  if (typeof obj.dockerfile === "string") add("Dockerfile", obj.dockerfile);
  if (typeof obj.readme === "string") add("README.md", obj.readme);
  if (typeof obj.envExample === "string") add(".env.example", obj.envExample);
  if (out.length === 0) throw new Error("No deployment artifacts produced");
  return out;
}

// ---------------------------------------------------------------------------
// Agent prompt builders
// ---------------------------------------------------------------------------

function buildAgentPrompt(agent: AgentName, prompt: string, priorArtifacts: Artifact[]): { system: string; user: string } {
  const priorSummary = priorArtifacts.length === 0
    ? "No prior artifacts yet."
    : "Prior artifacts:\n" + priorArtifacts.map(a => `- ${a.path}`).join("\n");

  switch (agent) {
    case "product_strategist":
      return {
        system: "You are a product strategist. Output STRICT JSON only.",
        user: `Product idea: ${prompt}\n\nReturn JSON:\n{ "productName": "string", "oneLiner": "string", "targetAudience": "string", "keyFeatures": ["string"] }`,
      };
    case "system_architect":
      return {
        system: "You are a system architect. Output STRICT JSON only.",
        user: `Product: ${prompt}\n\n${priorSummary}\n\nReturn JSON:\n{ "supabaseMigration": "SQL string with CREATE TABLE", "typescriptTypes": "TypeScript interface/type definitions", "apiRoutes": ["string"] }`,
      };
    case "ui_ux_designer":
      return {
        system: "You are a UI/UX designer. Output STRICT JSON only.",
        user: `Product: ${prompt}\n\n${priorSummary}\n\nReturn JSON:\n{ "tailwindConfig": { "theme": { "extend": {} } }, "colorPalette": { "primary": "#hex", "background": "#hex", "foreground": "#hex", "accent": "#hex" }, "layoutSpec": { "grid": "string", "spacing": "string" } }`,
      };
    case "frontend_engineer":
      return {
        system: "You are a frontend engineer. Output STRICT JSON only.",
        user: `Product: ${prompt}\n\n${priorSummary}\n\nReturn JSON:\n{ "files": [ { "path": "src/routes/index.tsx", "content": "full file content" }, { "path": "src/components/Header.tsx", "content": "full file content" } ] }\nAll paths relative. No markdown fences.`,
      };
    case "backend_engineer":
      return {
        system: "You are a backend engineer. Output STRICT JSON only.",
        user: `Product: ${prompt}\n\n${priorSummary}\n\nReturn JSON:\n{ "files": [ { "path": "src/lib/functions/tasks.server.ts", "content": "full file content" } ] }\nAll paths relative. No markdown fences.`,
      };
    case "deployment_agent":
      return {
        system: "You are a deployment engineer. Output STRICT JSON only.",
        user: `Product: ${prompt}\n\n${priorSummary}\n\nReturn JSON:\n{ "vercelConfig": "JSON string", "dockerfile": "string", "readme": "string", "envExample": "string" }`,
      };
  }
}

// ---------------------------------------------------------------------------
// DB helpers
// ---------------------------------------------------------------------------

async function emitEvent(supabase: any, runId: string, payload: EventPayload) {
  const agentName = ("agent" in payload ? payload.agent : undefined) ?? null;
  await supabase.from("run_events").insert({
    run_id: runId,
    agent_name: agentName,
    event_type: payload.type,
    payload,
  });
}

async function updateRun(supabase: any, runId: string, patch: Record<string, unknown>) {
  await supabase.from("runs").update(patch).eq("id", runId);
}

async function updateAgent(supabase: any, agentId: string, patch: Record<string, unknown>) {
  await supabase.from("run_agents").update(patch).eq("id", agentId);
}

async function insertArtifact(supabase: any, runId: string, agentName: string, artifact: Artifact) {
  await supabase.from("run_artifacts").insert({
    run_id: runId,
    agent_name: agentName,
    path: artifact.path,
    content: artifact.content,
    language: artifact.language,
    size_bytes: new TextEncoder().encode(artifact.content).length,
  });
}

async function upsertMetrics(supabase: any, runId: string, tokens: number, latencyMs: number, provider: string) {
  const { data: existing } = await supabase.from("run_metrics").select("*").eq("run_id", runId).maybeSingle();
  const mix = { ...(existing?.provider_mix ?? {}), [provider]: ((existing?.provider_mix?.[provider] as number) ?? 0) + 1 };
  if (existing) {
    await supabase.from("run_metrics").update({
      total_tokens: (existing.total_tokens ?? 0) + tokens,
      total_latency_ms: (existing.total_latency_ms ?? 0) + latencyMs,
      provider_mix: mix,
    }).eq("run_id", runId);
  } else {
    await supabase.from("run_metrics").insert({
      run_id: runId,
      total_tokens: tokens,
      total_latency_ms: latencyMs,
      provider_mix: mix,
    });
  }
}

// ---------------------------------------------------------------------------
// SSE stream writer
// ---------------------------------------------------------------------------

function sse(payload: unknown) {
  return `data: ${JSON.stringify(payload)}\n\n`;
}

// ---------------------------------------------------------------------------
// Agent executor
// ---------------------------------------------------------------------------

async function executeAgent(
  supabase: any,
  runId: string,
  agentDef: typeof AGENTS[number],
  agentRow: RunAgent,
  prompt: string,
  priorArtifacts: Artifact[],
  encoder: TextEncoder,
  controller: ReadableStreamDefaultController,
): Promise<{ artifacts: Artifact[]; tokens: number; latencyMs: number; provider: string } | null> {
  const started = Date.now();
  const { system, user } = buildAgentPrompt(agentDef.name, prompt, priorArtifacts);

  await emitEvent(supabase, runId, { type: "transition", agent: agentDef.name, status: "running" });
  controller.enqueue(encoder.encode(sse({ type: "transition", agent: agentDef.name, status: "running" })));
  await updateAgent(supabase, agentRow.id, { status: "running", started_at: new Date().toISOString() });
  await updateRun(supabase, runId, { current_agent: agentDef.name, status: "running" });

  let attempt = 0;
  while (attempt <= agentDef.maxRetries) {
    attempt += 1;
    const attemptStart = Date.now();
    const controllerSignal = new AbortController();
    const timeoutId = setTimeout(() => controllerSignal.abort(), agentDef.timeoutMs);

    try {
      const { content, provider, tokens } = await runWithFallback(system, user, controllerSignal.signal);
      clearTimeout(timeoutId);

      let artifacts: Artifact[] = [];
      switch (agentDef.name) {
        case "product_strategist":
          const strat = validateStrategistOutput(content);
          artifacts = [{ path: "docs/product-strategy.json", content: JSON.stringify(strat, null, 2), language: "json" }];
          break;
        case "system_architect": {
          const arch = validateArchitectOutput(content);
          artifacts = [
            { path: "supabase/migrations/20260101000000_init.sql", content: arch.supabaseMigration, language: "sql" },
            { path: "src/lib/types.ts", content: arch.typescriptTypes, language: "typescript" },
          ];
          if (arch.apiRoutes.length > 0) {
            artifacts.push({ path: "docs/api-routes.md", content: arch.apiRoutes.map((r) => `- ${r}`).join("\n"), language: "markdown" });
          }
          break;
        }
        case "ui_ux_designer": {
          const design = validateDesignerOutput(content);
          artifacts = [
            { path: "tailwind.config.ts", content: `import type { Config } from "tailwindcss";\n\nexport default {\n  theme: { extend: ${JSON.stringify(design.tailwindConfig.theme?.extend ?? {}, null, 2)} },\n} satisfies Config;\n`, language: "typescript" },
            { path: "src/styles/design-tokens.css", content: `:root {\n  --color-primary: ${design.colorPalette.primary};\n  --color-background: ${design.colorPalette.background};\n  --color-foreground: ${design.colorPalette.foreground};\n  --color-accent: ${design.colorPalette.accent};\n}\n`, language: "css" },
          ];
          break;
        }
        case "frontend_engineer":
          artifacts = validateFrontendOutput(content);
          break;
        case "backend_engineer":
          artifacts = validateBackendOutput(content);
          break;
        case "deployment_agent":
          artifacts = validateDeploymentOutput(content);
          break;
      }

      const latencyMs = Date.now() - started;
      for (const a of artifacts) {
        await insertArtifact(supabase, runId, agentDef.name, a);
        await emitEvent(supabase, runId, { type: "artifact", agent: agentDef.name, path: a.path, language: a.language });
        controller.enqueue(encoder.encode(sse({ type: "artifact", agent: agentDef.name, path: a.path, language: a.language })));
      }

      await updateAgent(supabase, agentRow.id, {
        status: "done",
        finished_at: new Date().toISOString(),
        latency_ms: latencyMs,
        tokens_used: tokens,
      });
      await emitEvent(supabase, runId, { type: "transition", agent: agentDef.name, status: "done" });
      controller.enqueue(encoder.encode(sse({ type: "transition", agent: agentDef.name, status: "done" })));
      await upsertMetrics(supabase, runId, tokens, latencyMs, provider);

      return { artifacts, tokens, latencyMs, provider };
    } catch (e) {
      clearTimeout(timeoutId);
      const err = e instanceof Error ? e : new Error(String(e));
      await emitEvent(supabase, runId, { type: "log", agent: agentDef.name, message: `Attempt ${attempt} failed: ${err.message}` });
      controller.enqueue(encoder.encode(sse({ type: "log", agent: agentDef.name, message: `Attempt ${attempt} failed: ${err.message}` })));
      if (attempt > agentDef.maxRetries) {
        await updateAgent(supabase, agentRow.id, {
          status: "error",
          finished_at: new Date().toISOString(),
          error: err.message,
          retries: attempt - 1,
        });
        await emitEvent(supabase, runId, { type: "error", agent: agentDef.name, message: err.message });
        controller.enqueue(encoder.encode(sse({ type: "error", agent: agentDef.name, message: err.message })));
        await updateRun(supabase, runId, { status: "failed", agents_failed: supabase.sql`agents_failed + 1` });
        return null;
      }
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Main handler
// ---------------------------------------------------------------------------

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: { ...corsHeaders, "content-type": "application/json" } });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (!token) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "content-type": "application/json" } });
  }

  const { data: authData, error: authErr } = await supabase.auth.getUser(token);
  const userId = authData?.user?.id;
  if (authErr || !userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "content-type": "application/json" } });
  }

  const body = await req.json().catch(() => ({}));
  const projectId = typeof body?.projectId === "string" ? body.projectId : "";
  const prompt = typeof body?.prompt === "string" ? body.prompt.trim() : "";
  if (!projectId) throw new Error("projectId is required");
  if (prompt.length < 4) throw new Error("Prompt too short");

  const traceId = crypto.randomUUID();
  const { data: run, error: runErr } = await supabase
    .from("runs")
    .insert({
      project_id: projectId,
      user_id: userId,
      status: "queued",
      prompt,
      trace_id: traceId,
    })
    .select("id")
    .single();

  if (runErr || !run) throw new Error(runErr?.message ?? "Failed to create run");
  const runId = run.id as string;

  // Seed agent rows
  const agentRows = await supabase.from("run_agents").insert(
    AGENTS.map((a) => ({ run_id: runId, name: a.name, status: "pending" }))
  );

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      controller.enqueue(encoder.encode(sse({ type: "start", runId, traceId })));

      let allArtifacts: Artifact[] = [];
      let failed = false;

      for (const agentDef of AGENTS) {
        if (failed) {
          await updateAgent(supabase, (agentRows.data as any[]).find((r) => r.name === agentDef.name).id, { status: "skipped" });
          continue;
        }

        const agentRow = (agentRows.data as any[]).find((r) => r.name === agentDef.name)!;
        const result = await executeAgent(supabase, runId, agentDef, agentRow, prompt, allArtifacts, encoder, controller);
        if (!result) {
          failed = true;
          continue;
        }
        allArtifacts = [...allArtifacts, ...result.artifacts];
      }

      const finalStatus = failed ? "failed" : "completed";
      await updateRun(supabase, runId, {
        status: finalStatus,
        current_agent: null,
        result: { artifacts: allArtifacts.map((a) => ({ path: a.path, language: a.language })) },
      });
      await emitEvent(supabase, runId, { type: "complete", result: { runId, traceId } });
      controller.enqueue(encoder.encode(sse({ type: "complete", result: { runId, traceId } })));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      ...corsHeaders,
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-cache, no-transform",
      connection: "keep-alive",
      "x-signhify-trace-id": traceId,
    },
  });
});

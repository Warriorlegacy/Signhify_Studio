import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const tools = [
  {
    name: "code_gen",
    description: "Generate a React component",
    input_schema: {
      type: "object",
      properties: { componentName: { type: "string" }, description: { type: "string" } },
      required: ["componentName", "description"],
    },
  },
  {
    name: "schema_design",
    description: "Generate a Supabase migration SQL",
    input_schema: {
      type: "object",
      properties: { tableName: { type: "string" }, columns: { type: "string" } },
      required: ["tableName"],
    },
  },
  {
    name: "design_tokens",
    description: "Generate Tailwind CSS design tokens",
    input_schema: {
      type: "object",
      properties: { theme: { type: "string" } },
      required: ["theme"],
    },
  },
  {
    name: "deploy_trigger",
    description: "Trigger a deployment",
    input_schema: {
      type: "object",
      properties: { projectSlug: { type: "string" } },
      required: ["projectSlug"],
    },
  },
];
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const started = Date.now();
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");
  const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
  let runId = "";
  try {
    const body = await req.json();
    const project_id = String(body.project_id ?? "");
    const prompt = String(body.prompt ?? "");
    runId = String(body.run_id ?? "");
    const bearer = req.headers.get("authorization")?.replace("Bearer ", "") ?? "";
    if (!bearer || bearer === serviceKey) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "content-type": "application/json" },
      });
    }
    const { data: authData, error: authError } = await admin.auth.getUser(bearer);
    const userId = authData?.user?.id ?? "";
    if (authError || !userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "content-type": "application/json" },
      });
    }
    if (!project_id || !prompt) throw new Error("Missing input");
    if (runId) {
      // Verify the caller owns the referenced run before mutating it.
      const { data: existing } = await admin
        .from("runs")
        .select("user_id")
        .eq("id", runId)
        .maybeSingle();
      if (!existing || existing.user_id !== userId) {
        return new Response(JSON.stringify({ error: "Forbidden" }), {
          status: 403,
          headers: { ...corsHeaders, "content-type": "application/json" },
        });
      }
    }
    if (!runId) {
      const { data: pending } = await admin
        .from("runs")
        .select("id")
        .eq("project_id", project_id)
        .eq("user_id", userId)
        .eq("status", "pending")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      runId = pending?.id;
    }
    if (!runId) {
      const { data: created } = await admin
        .from("runs")
        .insert({ project_id, user_id: userId, status: "pending", log: [] })
        .select("id")
        .single();
      runId = created.id;
    }
    await admin.from("runs").update({ status: "running" }).eq("id", runId);
    const groqKey = Deno.env.get("GROQ_API_KEY");
    const openrouterKey = Deno.env.get("OPENROUTER_API_KEY");
    const mistralKey = Deno.env.get("MISTRAL_API_KEY");
    const cerebrasKey = Deno.env.get("CEREBRAS_API_KEY");
    const geminiKey = Deno.env.get("GEMINI_API_KEY");

    let apiUrl = "";
    let apiKey = "";
    let modelName = "";
    let isAnthropic = false;

    if (cerebrasKey) {
      apiUrl = "https://api.cerebras.ai/v1/chat/completions";
      apiKey = cerebrasKey;
      modelName = "llama-3.3-70b";
    } else if (geminiKey) {
      apiUrl = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
      apiKey = geminiKey;
      modelName = "gemini-2.5-flash";
    } else if (groqKey) {
      apiUrl = "https://api.groq.com/openai/v1/chat/completions";
      apiKey = groqKey;
      modelName = "llama-3.3-70b-versatile";
    } else if (openrouterKey) {
      apiUrl = "https://openrouter.ai/api/v1/chat/completions";
      apiKey = openrouterKey;
      modelName = "google/gemini-2.5-flash";
    } else if (mistralKey) {
      apiUrl = "https://api.mistral.ai/v1/chat/completions";
      apiKey = mistralKey;
      modelName = "mistral-tiny";
    } else if (anthropicKey) {
      apiUrl = "https://api.anthropic.com/v1/messages";
      apiKey = anthropicKey;
      modelName = "claude-3-5-sonnet-20241022";
      isAnthropic = true;
    } else {
      throw new Error(
        "No working API key configured on the server. Set CEREBRAS_API_KEY, GEMINI_API_KEY, or GROQ_API_KEY.",
      );
    }

    const requestHeaders: Record<string, string> = {
      "content-type": "application/json",
    };
    let body: Record<string, unknown> | undefined;

    if (isAnthropic) {
      requestHeaders["x-api-key"] = apiKey;
      requestHeaders["anthropic-version"] = "2023-06-01";
      body = {
        model: modelName,
        max_tokens: 4096,
        tools,
        messages: [
          {
            role: "user",
            content: `Build a Signhify project plan for: ${prompt}. Use each available tool once with realistic inputs.`,
          },
        ],
      };
    } else {
      requestHeaders["Authorization"] = `Bearer ${apiKey}`;
      const openAiTools = tools.map((t) => ({
        type: "function",
        function: {
          name: t.name,
          description: t.description,
          parameters: t.input_schema,
        },
      }));
      body = {
        model: modelName,
        max_tokens: 4096,
        tools: openAiTools,
        tool_choice: "auto",
        messages: [
          {
            role: "user",
            content: `Build a Signhify project plan for: ${prompt}. Use each available tool once with realistic inputs.`,
          },
        ],
      };
    }

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: requestHeaders,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => "");
      throw new Error(`${modelName} request failed with status ${res.status}: ${errorText}`);
    }

    const json = await res.json();
    const totalTokens = (json?.usage?.input_tokens ?? 0) + (json?.usage?.output_tokens ?? 0);
    const elapsed = Date.now() - started;
    async function append(entry: Record<string, unknown>) {
      const { data: row } = await admin.from("runs").select("log").eq("id", runId).single();
      await admin
        .from("runs")
        .update({ log: [...(Array.isArray(row?.log) ? row.log : []), entry] })
        .eq("id", runId);
    }
    if (totalTokens > 100000 || elapsed > 120000) {
      await append({ error: "Budget exceeded", tokens_used: totalTokens, elapsed_ms: elapsed });
      await admin.from("runs").update({ status: "budget_exceeded" }).eq("id", runId);
      return new Response(
        JSON.stringify({ error: "Budget exceeded", tokens_used: totalTokens, elapsed_ms: elapsed }),
        { status: 402, headers: { ...corsHeaders, "content-type": "application/json" } },
      );
    }
    let toolCalls = [];
    if (isAnthropic) {
      toolCalls = (json?.content ?? []).filter((c: { type: string }) => c.type === "tool_use");
    } else {
      const rawCalls = json?.choices?.[0]?.message?.tool_calls ?? [];
      toolCalls = rawCalls.map((c: { function: { name: string; arguments: string } }) => {
        let args = {};
        try {
          args =
            typeof c.function.arguments === "string"
              ? JSON.parse(c.function.arguments)
              : c.function.arguments;
        } catch {
          // Ignore parse issues
        }
        return {
          name: c.function.name,
          input: args,
        };
      });
    }
    const fallback = toolCalls.length
      ? toolCalls
      : tools.map((t) => ({ name: t.name, input: { prompt } }));
    for (const call of fallback) {
      const toolStarted = Date.now();
      let output: Record<string, unknown> = { ok: true };
      if (call.name === "deploy_trigger") {
        const projectSlug = String(call.input?.projectSlug ?? project_id.slice(0, 8));
        // TODO(cloudflare-edge): direct upload is represented as a deploy intent until Cloudflare artifact manifests are normalized.
        output = {
          deploymentUrl: `https://${projectSlug}.signhify.app`,
          intent: "cloudflare_pages",
        };
      } else if (call.name === "code_gen")
        output = {
          component: `export function ${call.input?.componentName ?? "GeneratedComponent"}(){ return <section>Generated by Signhify</section>; }`,
        };
      else if (call.name === "schema_design")
        output = {
          sql: `create table public.${call.input?.tableName ?? "generated"} (id uuid primary key default gen_random_uuid());`,
        };
      else if (call.name === "design_tokens")
        output = { tokens: { theme: call.input?.theme ?? "ember", primary: "#ff6b00" } };
      await append({
        tool: call.name,
        input: call.input,
        output,
        elapsed_ms: Date.now() - toolStarted,
      });
    }
    await admin.from("runs").update({ status: "complete" }).eq("id", runId);
    return new Response(JSON.stringify({ runId }), {
      headers: { ...corsHeaders, "content-type": "application/json" },
    });
  } catch (error) {
    if (runId) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      const { data: row } = await admin.from("runs").select("log").eq("id", runId).maybeSingle();
      await admin
        .from("runs")
        .update({
          status: "failed",
          log: [
            ...(Array.isArray(row?.log) ? row.log : []),
            { error: msg, elapsed_ms: Date.now() - started },
          ],
        })
        .eq("id", runId);
    }
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Run failed" }),
      { status: 500, headers: { ...corsHeaders, "content-type": "application/json" } },
    );
  }
});

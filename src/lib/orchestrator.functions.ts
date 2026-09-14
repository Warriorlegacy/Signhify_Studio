import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { resolveAIAccess } from "./ai-access.server";
import { withByokKeys } from "./byok-middleware";

export type OrchestratorRunStatus = {
  runId: string;
  traceId: string;
  status: string;
  currentAgent: string | null;
  agents: Array<{
    name: string;
    status: string;
    latencyMs: number | null;
    tokensUsed: number;
    error: string | null;
  }>;
  artifacts: Array<{ path: string; language: string | null }>;
};

export const createOrchestratorRun = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth, withByokKeys])
  .inputValidator((input: unknown) => {
    const obj = input as Record<string, unknown>;
    const projectId = typeof obj?.projectId === "string" ? obj.projectId.trim() : "";
    const prompt = typeof obj?.prompt === "string" ? obj.prompt.trim() : "";
    if (!projectId) throw new Error("projectId is required");
    if (prompt.length < 4) throw new Error("Prompt too short");
    return { projectId, prompt };
  })
  .handler(async ({ data, context }) => {
    const { supabase, userId, claims } = context as {
      supabase: any;
      userId: string;
      claims?: { email?: string | null };
    };
    const byokClientKeys = (context as { byokClientKeys?: Record<string, string> }).byokClientKeys;
    await resolveAIAccess({ supabase, userId, email: claims?.email ?? null, byokClientKeys });

    const { data: run, error } = await supabase
      .from("runs")
      .insert({
        project_id: data.projectId,
        user_id: userId,
        status: "queued",
        prompt: data.prompt,
        trace_id: crypto.randomUUID(),
      })
      .select("id, trace_id")
      .single();

    if (error || !run) throw new Error(error?.message ?? "Failed to create run");

    await supabase.from("run_agents").insert([
      { run_id: run.id, name: "product_strategist", status: "pending" },
      { run_id: run.id, name: "system_architect", status: "pending" },
      { run_id: run.id, name: "ui_ux_designer", status: "pending" },
      { run_id: run.id, name: "frontend_engineer", status: "pending" },
      { run_id: run.id, name: "backend_engineer", status: "pending" },
      { run_id: run.id, name: "deployment_agent", status: "pending" },
    ]);

    return { runId: run.id, traceId: run.trace_id };
  });

export const getOrchestratorRun = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => ({ runId: String((input as any)?.runId ?? "").trim() }))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as { supabase: any; userId: string };
    const { data: run, error: runErr } = await supabase
      .from("runs")
      .select("*")
      .eq("id", data.runId)
      .eq("user_id", userId)
      .maybeSingle();
    if (runErr || !run) return null;

    const { data: agents } = await supabase
      .from("run_agents")
      .select("name, status, latency_ms, tokens_used, error")
      .eq("run_id", data.runId)
      .order("created_at", { ascending: true });

    const { data: artifacts } = await supabase
      .from("run_artifacts")
      .select("path, language")
      .eq("run_id", data.runId)
      .order("created_at", { ascending: true });

    return {
      runId: run.id,
      traceId: run.trace_id,
      status: run.status,
      currentAgent: run.current_agent,
      agents: (agents ?? []).map((a: any) => ({
        name: a.name,
        status: a.status,
        latencyMs: a.latency_ms,
        tokensUsed: a.tokens_used,
        error: a.error,
      })),
      artifacts: (artifacts ?? []).map((a: any) => ({ path: a.path, language: a.language })),
    } as OrchestratorRunStatus;
  });

export const getOrchestratorArtifacts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => ({ runId: String((input as any)?.runId ?? "").trim() }))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as { supabase: any; userId: string };
    const { data: run, error: runErr } = await supabase
      .from("runs")
      .select("id")
      .eq("id", data.runId)
      .eq("user_id", userId)
      .maybeSingle();
    if (runErr || !run) throw new Error("Run not found");

    const { data: artifacts } = await supabase
      .from("run_artifacts")
      .select("path, content, language")
      .eq("run_id", data.runId)
      .order("created_at", { ascending: true });

    return (artifacts ?? []).map((a: any) => ({
      path: a.path,
      content: a.content,
      language: a.language,
    }));
  });

export const getOrchestratorStreamConfig = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth, withByokKeys])
  .inputValidator((input: unknown) => {
    const obj = input as Record<string, unknown>;
    const runId = typeof obj?.runId === "string" ? obj.runId.trim() : "";
    if (!runId) throw new Error("runId is required");
    return { runId };
  })
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as { supabase: any; userId: string };
    const { data: run, error } = await supabase
      .from("runs")
      .select("id")
      .eq("id", data.runId)
      .eq("user_id", userId)
      .maybeSingle();
    if (error || !run) throw new Error("Run not found");

    const base = process.env.SUPABASE_URL;
    const request = getRequest();
    const userToken = request?.headers?.get("authorization")?.replace(/^Bearer\s+/i, "");
    const bearer =
      userToken || process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || "";
    if (!base || !bearer) throw new Error("Missing Supabase configuration");
    return {
      url: `${base.replace(/\/$/, "")}/functions/v1/orchestrator`,
      bearer,
      token: userToken,
      runId: data.runId,
    };
  });

import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const createRun = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    const projectId = String((input as any)?.projectId ?? "");
    const prompt = String((input as any)?.prompt ?? "").trim();
    if (!projectId) throw new Error("Project is required.");
    if (prompt.length < 3) throw new Error("Prompt must be at least 3 characters.");
    return { projectId, prompt };
  })
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    const { data: run, error } = await supabase
      .from("runs")
      .insert({ project_id: data.projectId, user_id: userId, status: "pending", log: [] })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    const edge = process.env.SUPABASE_URL
      ? `${process.env.SUPABASE_URL.replace(/\/$/, "")}/functions/v1/run-agent`
      : null;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (edge && serviceKey) {
      fetch(edge, {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${serviceKey}` },
        body: JSON.stringify({ project_id: data.projectId, prompt: data.prompt, run_id: run.id }),
      }).catch((e) => console.error("[run-agent] invoke failed", e));
    }
    return { runId: run.id as string };
  });

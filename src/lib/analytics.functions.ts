import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getProjectAnalytics = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => ({ projectId: String((input as any)?.projectId ?? "") }))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { data: project } = await supabase.from("user_projects").select("id").eq("id", data.projectId).eq("user_id", userId).single();
    if (!project) throw new Error("Project not found.");
    const { data: rows, error } = await supabase.from("analytics").select("path,referrer,country,created_at").eq("project_id", data.projectId).gte("created_at", since);
    if (error) throw new Error(error.message);
    return { rows: rows ?? [] };
  });

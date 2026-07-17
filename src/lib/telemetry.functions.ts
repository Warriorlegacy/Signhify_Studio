import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const logTelemetryError = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    const obj = input as Record<string, unknown>;
    const projectId = typeof obj?.projectId === "string" ? obj.projectId : "";
    const exceptionMessage = typeof obj?.exceptionMessage === "string" ? obj.exceptionMessage : "";
    const stackTrace = typeof obj?.stackTrace === "string" ? obj.stackTrace : "";
    if (!projectId) throw new Error("projectId is required");
    if (!exceptionMessage) throw new Error("exceptionMessage is required");
    return { projectId, exceptionMessage, stackTrace };
  })
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { userId } = context;

    // Verify user owns the project
    const { data: project, error: pError } = await supabaseAdmin
      .from("user_projects")
      .select("id")
      .eq("id", data.projectId)
      .eq("user_id", userId)
      .maybeSingle();

    if (pError || !project) {
      throw new Error("Unauthorized or project not found.");
    }

    const { error: insertError } = await supabaseAdmin
      .from("run_errors")
      .insert({
        project_id: data.projectId,
        exception_message: data.exceptionMessage,
        stack_trace: data.stackTrace || null,
        resolved: false,
      });

    if (insertError) {
      console.error("[logTelemetryError] failed:", insertError);
      throw new Error(insertError.message);
    }

    return { success: true };
  });

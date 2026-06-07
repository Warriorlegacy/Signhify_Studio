import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

function projectInput(input: unknown) {
  const title = String((input as any)?.title ?? "").trim();
  const description = String((input as any)?.description ?? "").trim();
  if (title.length < 3) throw new Error("Title must be at least 3 characters.");
  return { title, description: description || null };
}

export const createProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(projectInput)
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as any;
    const { data: row, error } = await supabase.from("user_projects").insert({ title: data.title, description: data.description, user_id: userId }).select("id").single();
    if (error) throw new Error(error.message);
    return { id: row.id as string };
  });

export const updateProjectTitle = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => ({ projectId: String((input as any)?.projectId ?? ""), title: String((input as any)?.title ?? "").trim() }))
  .handler(async ({ data, context }) => {
    if (data.title.length < 3) throw new Error("Title must be at least 3 characters.");
    const { supabase, userId } = context as any;
    const { error } = await supabase.from("user_projects").update({ title: data.title }).eq("id", data.projectId).eq("user_id", userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

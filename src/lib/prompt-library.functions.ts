import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type SavedPrompt = {
  id: string;
  title: string;
  body: string;
  category: string;
  created_at: string;
  updated_at: string;
};

export type PromptVersion = {
  id: string;
  prompt_id: string;
  version: number;
  body: string;
  project_id: string | null;
  project_title: string | null;
  created_at: string;
};

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

export const listSavedPrompts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("prompt_library")
      .select("id, title, body, category, created_at, updated_at")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });
    if (error) throw new Error("Could not load your prompt library.");
    return (data ?? []) as SavedPrompt[];
  });

export const savePrompt = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    const o = input as Record<string, unknown>;
    const title = str(o?.title).slice(0, 120);
    const body = str(o?.body).slice(0, 8000);
    const category = (str(o?.category) || "general").slice(0, 40);
    const id = str(o?.id) || null;
    if (!title) throw new Error("Give the prompt a name.");
    if (body.length < 10) throw new Error("The prompt is too short.");
    return { id, title, body, category };
  })
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;

    if (data.id) {
      const { data: existing, error: readError } = await supabase
        .from("prompt_library")
        .select("id, body")
        .eq("id", data.id)
        .eq("user_id", userId)
        .single();
      if (readError || !existing) throw new Error("Prompt not found.");

      const { data: updated, error } = await supabase
        .from("prompt_library")
        .update({
          title: data.title,
          body: data.body,
          category: data.category,
          updated_at: new Date().toISOString(),
        })
        .eq("id", data.id)
        .eq("user_id", userId)
        .select("id, title, body, category, created_at, updated_at")
        .single();
      if (error) throw new Error("Could not save the prompt.");

      // Only record a version when the prompt text actually changed.
      if (existing.body !== data.body) {
        const { count } = await supabase
          .from("prompt_versions")
          .select("id", { count: "exact", head: true })
          .eq("prompt_id", data.id);
        await supabase.from("prompt_versions").insert({
          prompt_id: data.id,
          user_id: userId,
          version: (count ?? 0) + 1,
          body: data.body,
        });
      }
      return updated as SavedPrompt;
    }

    const { data: created, error } = await supabase
      .from("prompt_library")
      .insert({
        user_id: userId,
        title: data.title,
        body: data.body,
        category: data.category,
      })
      .select("id, title, body, category, created_at, updated_at")
      .single();
    if (error) throw new Error("Could not save the prompt.");

    await supabase.from("prompt_versions").insert({
      prompt_id: created.id,
      user_id: userId,
      version: 1,
      body: data.body,
    });
    return created as SavedPrompt;
  });

export const deleteSavedPrompt = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    const id = str((input as Record<string, unknown>)?.id);
    if (!id) throw new Error("Prompt ID is required.");
    return { id };
  })
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const { error } = await supabase
      .from("prompt_library")
      .delete()
      .eq("id", data.id)
      .eq("user_id", userId);
    if (error) throw new Error("Could not delete the prompt.");
    return { ok: true };
  });

export const listPromptVersions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    const id = str((input as Record<string, unknown>)?.promptId);
    if (!id) throw new Error("Prompt ID is required.");
    return { promptId: id };
  })
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const { data: rows, error } = await supabase
      .from("prompt_versions")
      .select("id, prompt_id, version, body, project_id, project_title, created_at")
      .eq("prompt_id", data.promptId)
      .eq("user_id", userId)
      .order("version", { ascending: false });
    if (error) throw new Error("Could not load the prompt history.");
    return (rows ?? []) as PromptVersion[];
  });

/**
 * Records that a saved prompt produced a blueprint, so the history shows which
 * prompt version generated which project.
 */
export const recordPromptRun = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    const o = input as Record<string, unknown>;
    const promptId = str(o?.promptId);
    const body = str(o?.body).slice(0, 8000);
    const projectId = str(o?.projectId) || null;
    const projectTitle = str(o?.projectTitle).slice(0, 160) || null;
    if (!promptId || !body) throw new Error("Prompt is required.");
    return { promptId, body, projectId, projectTitle };
  })
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const { data: owned } = await supabase
      .from("prompt_library")
      .select("id")
      .eq("id", data.promptId)
      .eq("user_id", userId)
      .maybeSingle();
    if (!owned) return { ok: false };

    const { count } = await supabase
      .from("prompt_versions")
      .select("id", { count: "exact", head: true })
      .eq("prompt_id", data.promptId);

    await supabase.from("prompt_versions").insert({
      prompt_id: data.promptId,
      user_id: userId,
      version: (count ?? 0) + 1,
      body: data.body,
      project_id: data.projectId,
      project_title: data.projectTitle,
    });
    return { ok: true };
  });

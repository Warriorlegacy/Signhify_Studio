import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getScrollStudioProjects = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: projects, error } = await supabase
      .from("user_projects")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[getScrollStudioProjects] Error:", error);
      throw new Error("Failed to fetch projects");
    }

    return projects;
  });

export const getScrollStudioProject = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    const id = (input as Record<string, unknown>)?.id;
    if (typeof id !== "string" || !id.trim()) throw new Error("Project ID is required");
    return { id: id.trim() };
  })
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const { data: project, error } = await supabase
      .from("user_projects")
      .select("*")
      .eq("id", data.id)
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("[getScrollStudioProject] Error:", error);
      throw new Error("Failed to fetch project");
    }

    return project;
  });

export const createScrollStudioProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    const obj = input as Record<string, unknown>;
    const title = typeof obj?.title === "string" ? obj.title.trim() : "";
    const initialPrompt = typeof obj?.initialPrompt === "string" ? obj.initialPrompt.trim() : "";
    if (!title) throw new Error("Title is required");
    return { title, initialPrompt };
  })
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const { title, initialPrompt } = data;

    const { data: project, error } = await supabase
      .from("user_projects")
      .insert({
        user_id: userId,
        title,
        description: initialPrompt,
        conversation_history: [
          {
            id: "welcome",
            role: "assistant",
            content: "Welcome to Scroll Studio! Describe the cinematic website you want to build.",
          },
          {
            id: Date.now().toString(),
            role: "user",
            content: initialPrompt,
          },
        ],
      })
      .select()
      .single();

    if (error) {
      console.error("[createScrollStudioProject] Error:", error);
      throw new Error("Failed to create project");
    }

    return project;
  });

export const updateScrollStudioProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    const obj = input as Record<string, unknown>;
    const id = typeof obj?.id === "string" ? obj.id : "";
    if (!id) throw new Error("Project ID is required");
    // Restrict mutable fields to a safe allowlist
    const u = (obj?.updates ?? {}) as Record<string, unknown>;
    const updates: Record<string, unknown> = {};
    for (const k of [
      "title",
      "description",
      "current_html",
      "current_css",
      "current_js",
      "conversation_history",
      "settings",
      "status",
      "frame_metadata",
      "published_url",
    ]) {
      if (k in u) updates[k] = u[k];
    }
    return { id, updates };
  })
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const { id, updates } = data;

    const { data: project, error } = await supabase
      .from("user_projects")
      .update(updates)
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      console.error("[updateScrollStudioProject] Error:", error);
      throw new Error("Failed to update project");
    }

    return project;
  });

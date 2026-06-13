import { createServerFn } from "@tanstack/react-start";

export const getScrollStudioProjects = createServerFn({ method: "GET" })
  .handler(async () => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: projects, error } = await (supabaseAdmin as any)
      .from("user_projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[getScrollStudioProjects] Error:", error);
      throw new Error("Failed to fetch projects");
    }

    return projects;
  });

export const getScrollStudioProject = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => {
    const obj = input as Record<string, unknown>;
    const id = typeof obj?.id === "string" ? obj.id : "";
    if (!id) throw new Error("Project ID is required");
    return { id };
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: project, error } = await (supabaseAdmin as any)
      .from("user_projects")
      .select("*")
      .eq("id", data.id)
      .single();

    if (error) {
      console.error("[getScrollStudioProject] Error:", error);
      throw new Error("Failed to fetch project");
    }

    return project;
  });

export const createScrollStudioProject = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const obj = input as Record<string, unknown>;
    const title = typeof obj?.title === "string" ? obj.title : "Untitled Project";
    const initialPrompt = typeof obj?.initialPrompt === "string" ? obj.initialPrompt : "";
    const userId = typeof obj?.userId === "string" ? obj.userId : "";
    if (!userId) throw new Error("User ID is required to create a project");
    return { title, initialPrompt, userId };
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: project, error } = await (supabaseAdmin as any)
      .from("user_projects")
      .insert({
        user_id: data.userId,
        name: data.title,
        description: data.initialPrompt,
        conversation_history: [{
          id: "welcome",
          role: "assistant",
          content: "Welcome to Scroll Studio! Describe the cinematic website you want to build."
        }, {
          id: Date.now().toString(),
          role: "user",
          content: data.initialPrompt
        }]
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
  .inputValidator((input: unknown) => {
    const obj = input as Record<string, unknown>;
    const id = typeof obj?.id === "string" ? obj.id : "";
    const updates = typeof obj?.updates === "object" ? obj.updates : {};
    if (!id) throw new Error("Project ID is required");
    return { id, updates };
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: project, error } = await (supabaseAdmin as any)
      .from("user_projects")
      .update(data.updates)
      .eq("id", data.id)
      .select()
      .single();

    if (error) {
      console.error("[updateScrollStudioProject] Error:", error);
      throw new Error("Failed to update project");
    }

    return project;
  });

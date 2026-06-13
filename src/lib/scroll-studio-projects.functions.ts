import { createServerFn } from "@tanstack/react-start";

export const getScrollStudioProjects = createServerFn({ method: "GET" })
  .handler(async ({ context }) => {
    // Require authentication
    if (!context.userId) throw new Error("Unauthorized");

    const { supabase } = await import("@/integrations/supabase/client");
    const { data: projects, error } = await supabase
      .from("user_projects")
      .select("*")
      .eq("user_id", context.userId) // Only get current user's projects
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[getScrollStudioProjects] Error:", error);
      throw new Error("Failed to fetch projects");
    }

    return projects;
  });

export const getScrollStudioProject = createServerFn({ method: "GET" })
  .handler(async ({ context, data }) => {
    // Require authentication
    if (!context.userId) throw new Error("Unauthorized");

    const { supabase } = await import("@/integrations/supabase/client");
    const { data: project, error } = await supabase
      .from("user_projects")
      .select("*")
      .eq("id", data.id)
      .eq("user_id", context.userId) // Ensure user owns the project
      .single();

    if (error) {
      console.error("[getScrollStudioProject] Error:", error);
      throw new Error("Failed to fetch project");
    }

    return project;
  });

export const createScrollStudioProject = createServerFn({ method: "POST" })
  .handler(async ({ context, data }) => {
    // Require authentication
    if (!context.userId) throw new Error("Unauthorized");

    // Use authenticated user's ID instead of client-supplied one
    const userId = context.userId;
    const { title, initialPrompt } = data;

    const { supabase } = await import("@/integrations/supabase/client");
    const { data: project, error } = await supabase
      .from("user_projects")
      .insert({
        user_id: userId,
        name: title,
        description: initialPrompt,
        conversation_history: [{
          id: "welcome",
          role: "assistant",
          content: "Welcome to Scroll Studio! Describe the cinematic website you want to build."
        }, {
          id: Date.now().toString(),
          role: "user",
          content: initialPrompt
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
  .handler(async ({ context, data }) => {
    // Require authentication
    if (!context.userId) throw new Error("Unauthorized");

    const { id, updates } = data;

    const { supabase } = await import("@/integrations/supabase/client");
    const { data: project, error } = await supabase
      .from("user_projects")
      .update(updates)
      .eq("id", id)
      .eq("user_id", context.userId) // Ensure user owns the project
      .select()
      .single();

    if (error) {
      console.error("[updateScrollStudioProject] Error:", error);
      throw new Error("Failed to update project");
    }

    return project;
  });

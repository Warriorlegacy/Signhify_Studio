import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  insertVideoJob,
  updateVideoJob,
  fetchVideoJob,
  fetchProjectFrames,
  insertFrames,
  updateProjectCode,
  type DbVideoJob,
  type DbFrame,
} from "./studio.server";

async function assertProjectOwnership(
  supabase: any,
  projectId: string,
  userId: string,
): Promise<void> {
  const { data, error } = await supabase
    .from("user_projects")
    .select("id")
    .eq("id", projectId)
    .eq("user_id", userId)
    .single();
  if (error || !data) throw new Error("Project not found or access denied");
}

export const triggerVideoGeneration = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    const obj = input as Record<string, unknown>;
    const projectId = typeof obj?.projectId === "string" ? obj.projectId : "";
    const prompt = typeof obj?.prompt === "string" ? obj.prompt.trim() : "";
    const style =
      typeof obj?.style === "string"
        ? (obj.style as "wireframe" | "glowing" | "particle")
        : "glowing";
    const frameCount = typeof obj?.frameCount === "number" ? obj.frameCount : 150;

    if (!projectId) throw new Error("Project ID is required");
    if (!prompt || prompt.length < 4) throw new Error("Prompt must be at least 4 characters");

    return { projectId, prompt, style, frameCount };
  })
  .handler(async ({ context, data }) => {
    const { projectId, prompt, style, frameCount } = data;
    const userId = context.userId;

    await assertProjectOwnership(context.supabase, projectId, userId);

    const job = await insertVideoJob({
      project_id: projectId,
      user_id: userId,
      userId,
      provider: "mock-runner",
      model: "runway-gen3-turbo",
      input_type: "text_to_video",
      duration_seconds: 8,
      aspect_ratio: "16:9",
      status: "queued",
    });

    if (!job) {
      throw new Error("Failed to create video job");
    }

    void simulateBackgroundProcessing(job.id, projectId, userId, frameCount, style);

    return { jobId: job.id };
  });

export const getVideoJobStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    const id = (input as Record<string, unknown>)?.jobId;
    if (typeof id !== "string" || !id.trim()) {
      throw new Error("Job ID is required.");
    }
    return { jobId: id.trim() };
  })
  .handler(async ({ context, data }): Promise<DbVideoJob | null> => {
    return fetchVideoJob(data.jobId, context.userId);
  });

export const getProjectFramesList = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    const id = (input as Record<string, unknown>)?.projectId;
    if (typeof id !== "string" || !id.trim()) {
      throw new Error("Project ID is required.");
    }
    return { projectId: id.trim() };
  })
  .handler(async ({ context, data }): Promise<DbFrame[]> => {
    await assertProjectOwnership(context.supabase, data.projectId, context.userId);
    return fetchProjectFrames(data.projectId, context.userId);
  });

export const saveProjectCodeServer = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    const obj = input as Record<string, unknown>;
    const projectId = typeof obj?.projectId === "string" ? obj.projectId : "";
    const html = typeof obj?.html === "string" ? obj.html : "";
    const css = typeof obj?.css === "string" ? obj.css : "";
    const js = typeof obj?.js === "string" ? obj.js : "";

    if (!projectId) throw new Error("Project ID is required");

    return { projectId, html, css, js };
  })
  .handler(async ({ context, data }) => {
    const success = await updateProjectCode(
      data.projectId,
      data.html,
      data.css,
      data.js,
      context.userId,
    );
    return { success };
  });

async function simulateBackgroundProcessing(
  jobId: string,
  projectId: string,
  userId: string,
  frameCount: number,
  style: string,
) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    await updateVideoJob(
      jobId,
      {
        status: "processing",
        started_at: new Date().toISOString(),
      },
      userId,
    );

    await new Promise((resolve) => setTimeout(resolve, 5000));

    const mockFrames: Array<Partial<DbFrame> & { video_job_id: string; userId: string }> = [];
    for (let i = 0; i < frameCount; i++) {
      mockFrames.push({
        video_job_id: jobId,
        project_id: projectId,
        frame_index: i,
        cdn_url: `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80&index=${i}`,
        width: 800,
        height: 450,
        file_size_bytes: 25 * 1024,
        userId,
      });
    }

    await insertFrames(mockFrames);

    await updateVideoJob(
      jobId,
      {
        status: "completed",
        frame_count: frameCount,
        cost_usd: 0.12,
        processing_time_ms: 8000,
        video_url:
          "https://assets.mixkit.co/videos/preview/mixkit-abstract-glowing-lines-41582-large.mp4",
        completed_at: new Date().toISOString(),
      },
      userId,
    );

    const { updateProjectSettings } = await import("./studio.server");
    await updateProjectSettings(
      projectId,
      {
        status: "completed",
        frame_metadata: {
          total_frames: frameCount,
          fps: 30,
          total_size_bytes: frameCount * 25 * 1024,
        },
        settings: {
          style,
          frameCount,
        },
      },
      userId,
    );
  } catch (err) {
    console.error("[studio.functions] background processing failed:", err);
    await updateVideoJob(
      jobId,
      {
        status: "failed",
        error_message: err instanceof Error ? err.message : String(err),
        completed_at: new Date().toISOString(),
      },
      userId,
    );
  }
}

import { createServerFn } from "@tanstack/react-start";
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

// Expose triggering video generation
export const triggerVideoGeneration = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const obj = input as Record<string, unknown>;
    const projectId = typeof obj?.projectId === "string" ? obj.projectId : "";
    const prompt = typeof obj?.prompt === "string" ? obj.prompt.trim() : "";
    const style =
      typeof obj?.style === "string"
        ? (obj.style as "wireframe" | "glowing" | "particle")
        : "glowing";
    const frameCount = typeof obj?.frameCount === "number" ? obj.frameCount : 150;
    const userId = typeof obj?.userId === "string" ? obj.userId : "";

    if (!projectId) throw new Error("Project ID is required");
    if (!prompt || prompt.length < 4) throw new Error("Prompt must be at least 4 characters");
    if (!userId) throw new Error("User ID is required");

    return { projectId, prompt, style, frameCount, userId };
  })
  .handler(async ({ data }) => {
    const { projectId, prompt, style, frameCount, userId } = data;

    // Create the job in queued state
    const job = await insertVideoJob({
      project_id: projectId,
      user_id: userId,
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

    // Trigger mock background rendering process
    void simulateBackgroundProcessing(job.id, projectId, userId, frameCount, style);

    return { jobId: job.id };
  });

// Expose polling job status
export const getVideoJobStatus = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => {
    const id = (input as Record<string, unknown>)?.jobId;
    if (typeof id !== "string" || !id.trim()) {
      throw new Error("Job ID is required.");
    }
    return { jobId: id.trim() };
  })
  .handler(async ({ data }): Promise<DbVideoJob | null> => {
    return fetchVideoJob(data.jobId);
  });

// Expose querying project frames
export const getProjectFramesList = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => {
    const id = (input as Record<string, unknown>)?.projectId;
    if (typeof id !== "string" || !id.trim()) {
      throw new Error("Project ID is required.");
    }
    return { projectId: id.trim() };
  })
  .handler(async ({ data }): Promise<DbFrame[]> => {
    return fetchProjectFrames(data.projectId);
  });

// Expose updating user project code
export const saveProjectCodeServer = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const obj = input as Record<string, unknown>;
    const projectId = typeof obj?.projectId === "string" ? obj.projectId : "";
    const html = typeof obj?.html === "string" ? obj.html : "";
    const css = typeof obj?.css === "string" ? obj.css : "";
    const js = typeof obj?.js === "string" ? obj.js : "";

    if (!projectId) throw new Error("Project ID is required");

    return { projectId, html, css, js };
  })
  .handler(async ({ data }) => {
    const success = await updateProjectCode(data.projectId, data.html, data.css, data.js);
    return { success };
  });

// Background simulation of AI video generation and frame extraction
async function simulateBackgroundProcessing(
  jobId: string,
  projectId: string,
  userId: string,
  frameCount: number,
  style: string,
) {
  try {
    // 1. Transition to processing
    await new Promise((resolve) => setTimeout(resolve, 3000));
    await updateVideoJob(jobId, {
      status: "processing",
      started_at: new Date().toISOString(),
    });

    // 2. Simulate frames extraction
    await new Promise((resolve) => setTimeout(resolve, 5000));

    const mockFrames: Partial<DbFrame>[] = [];
    for (let i = 0; i < frameCount; i++) {
      mockFrames.push({
        video_job_id: jobId,
        project_id: projectId,
        frame_index: i,
        // Procedural simulated CDN URLs using placeholder vectors
        cdn_url: `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80&index=${i}`,
        width: 800,
        height: 450,
        file_size_bytes: 25 * 1024, // 25KB mock WebP
      });
    }

    // Insert frames in database
    await insertFrames(mockFrames);

    // 3. Mark completed
    await updateVideoJob(jobId, {
      status: "completed",
      frame_count: frameCount,
      cost_usd: 0.12, // mock price for Runway generation
      processing_time_ms: 8000,
      video_url:
        "https://assets.mixkit.co/videos/preview/mixkit-abstract-glowing-lines-41582-large.mp4",
      completed_at: new Date().toISOString(),
    });

    // Also update project settings in user_projects
    const { updateProjectSettings } = await import("./studio.server");
    await updateProjectSettings(projectId, {
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
    });
  } catch (err) {
    console.error("[studio.functions] background processing failed:", err);
    await updateVideoJob(jobId, {
      status: "failed",
      error_message: err instanceof Error ? err.message : String(err),
      completed_at: new Date().toISOString(),
    });
  }
}

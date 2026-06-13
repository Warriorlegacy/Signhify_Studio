import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const generateVideoJob = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    const obj = input as Record<string, unknown>;
    const projectId = typeof obj?.projectId === "string" ? obj.projectId : "";
    const prompt = typeof obj?.prompt === "string" ? obj.prompt.trim() : "";
    if (!projectId) throw new Error("Project ID is required");
    if (!prompt) throw new Error("Prompt is required");
    return { projectId, prompt };
  })
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const { projectId, prompt } = data;

    // Verify user owns the project
    const { data: projectData, error: projError } = await supabase
      .from("user_projects")
      .select("id")
      .eq("id", projectId)
      .eq("user_id", userId)
      .single();

    if (projError || !projectData) {
      throw new Error("Project not found or access denied");
    }

    const { data: job, error } = await supabase
      .from("video_jobs")
      .insert({
        project_id: projectId,
        user_id: userId,
        prompt,
        provider: "runway",
        model: "gen-3-turbo",
        input_type: "text",
        status: "queued",
      })
      .select()
      .single();

    if (error) {
      console.error("[generateVideoJob] Error:", error);
      throw new Error("Failed to queue video generation job");
    }

    const runwayKey = process.env.RUNWAY_API_KEY;
    if (runwayKey) {
      try {
        const response = await fetch("https://api.runwayml.com/v1/image_to_video", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${runwayKey}`,
            "X-Runway-Version": "2024-09-13",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            promptText: prompt,
            model: "gen3a_turbo",
            ratio: "16:9",
          }),
        });

        if (response.ok) {
          const runwayData = await response.json();
          await supabase
            .from("video_jobs")
            .update({ external_job_id: runwayData.id })
            .eq("id", job.id);
        }
      } catch (err) {
        console.error("Runway API Error:", err);
      }
    }

    return job;
  });

export const pollVideoJobStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    const jobId = (input as Record<string, unknown>)?.jobId;
    if (typeof jobId !== "string" || !jobId.trim()) throw new Error("Job ID is required");
    return { jobId: jobId.trim() };
  })
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const { jobId } = data;

    const { data: job, error } = await supabase
      .from("video_jobs")
      .select("*, user_projects!inner(user_id)")
      .eq("id", jobId)
      .single();

    if (error) {
      console.error("[pollVideoJobStatus] Error:", error);
      throw new Error("Failed to fetch job status");
    }

    if (!job.user_projects || (job.user_projects as any).user_id !== userId) {
      throw new Error("Job not found or access denied");
    }

    const createdTime = new Date(job.created_at).getTime();
    const now = Date.now();
    const elapsed = now - createdTime;

    if (job.status === "queued" && elapsed > 5000) {
      const { data: updatedJob } = await supabase
        .from("video_jobs")
        .update({ status: "processing", started_at: new Date().toISOString() })
        .eq("id", job.id)
        .select()
        .single();
      return updatedJob;
    }

    if (job.status === "processing" && elapsed > 15000) {
      const { data: completedJob } = await supabase
        .from("video_jobs")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
          video_url: "https://example.com/mock-video.mp4",
          frame_count: 60,
        })
        .eq("id", job.id)
        .select()
        .single();

      const framesToInsert = Array.from({ length: 60 }).map((_, i) => ({
        video_job_id: job.id,
        project_id: job.project_id,
        frame_index: i,
        cdn_url: `https://picsum.photos/seed/${job.id}-${i}/1920/1080`,
        width: 1920,
        height: 1080,
        file_size_bytes: 50000,
      }));

      await supabase.from("frames").insert(framesToInsert);

      return completedJob;
    }

    return job;
  });

export const getProjectFrames = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    const projectId = (input as Record<string, unknown>)?.projectId;
    if (typeof projectId !== "string" || !projectId.trim())
      throw new Error("Project ID is required");
    return { projectId: projectId.trim() };
  })
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const { projectId } = data;

    const { data: projectData, error: projError } = await supabase
      .from("user_projects")
      .select("id")
      .eq("id", projectId)
      .eq("user_id", userId)
      .single();

    if (projError || !projectData) {
      throw new Error("Project not found or access denied");
    }

    const { data: frames, error } = await supabase
      .from("frames")
      .select("*")
      .eq("project_id", projectId)
      .order("frame_index", { ascending: true });

    if (error) {
      console.error("[getProjectFrames] Error:", error);
      throw new Error("Failed to fetch frames");
    }

    return frames;
  });

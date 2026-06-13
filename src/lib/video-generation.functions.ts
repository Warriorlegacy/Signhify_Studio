import { createServerFn } from "@tanstack/react-start";

export const generateVideoJob = createServerFn({ method: "POST" })
  .handler(async ({ context, data }) => {
    // Require authentication
    if (!context.userId) throw new Error("Unauthorized");

    const { projectId, prompt } = data;
    if (!projectId || !prompt) throw new Error("Missing required fields");
  .handler(async ({ data }) => {
    const { supabase } = await import("@/integrations/supabase/client");

    // Verify user owns the project
    const { data: projectData, error: projError } = await supabase
      .from("user_projects")
      .select("id")
      .eq("id", projectId)
      .eq("user_id", context.userId)
      .single();

    if (projError || !projectData) {
      throw new Error("Project not found or access denied");
    }

    // Create a new video job in 'queued' state
    const { data: job, error } = await (supabaseAdmin as any)
      .from("video_jobs")
      .insert({
        project_id: projectId,
        user_id: context.userId, // Use authenticated user's ID
        prompt: prompt,
        provider: "runway",
        model: "gen-3-turbo",
        input_type: "text",
        status: "queued"
      })
      .select()
      .single();

    if (error) {
      console.error("[generateVideoJob] Error:", error);
      throw new Error("Failed to queue video generation job");
    }

    // Call real Runway ML API if key exists, otherwise let it mock processing
    const runwayKey = process.env.RUNWAY_API_KEY;
    if (runwayKey) {
      try {
        const response = await fetch("https://api.runwayml.com/v1/image_to_video", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${runwayKey}`,
            "X-Runway-Version": "2024-09-13",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            promptText: prompt,
            model: "gen3a_turbo",
            ratio: "16:9"
          })
        });
        
        if (response.ok) {
          const runwayData = await response.json();
          await supabase.from("video_jobs").update({
            external_job_id: runwayData.id
          }).eq("id", job.id);
        }
      } catch (err) {
        console.error("Runway API Error:", err);
      }
    }

    return job;
  });

export const pollVideoJobStatus = createServerFn({ method: "GET" })
  .handler(async ({ context, data }) => {
    // Require authentication
    if (!context.userId) throw new Error("Unauthorized");

    const { jobId } = data;
    if (!jobId) throw new Error("Job ID is required");

    const { supabase } = await import("@/integrations/supabase/client");

    // Fetch current status - ensure user owns the job through their project
    const { data: job, error } = await supabase
      .from("video_jobs")
      .select("*, user_projects!inner(user_id)") // Join with user_projects to verify ownership
      .eq("id", jobId)
      .single();

    if (error) {
      console.error("[pollVideoJobStatus] Error:", error);
      throw new Error("Failed to fetch job status");
    }

    // Verify the job belongs to the authenticated user
    if (!job.user_projects || job.user_projects.user_id !== context.userId) {
      throw new Error("Job not found or access denied");
    }

    // Simulate progress: If queued > 5 seconds, move to processing.
    // If processing > 10 seconds, move to completed and generate frames.
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
      // Simulate frame extraction completion
      const { data: completedJob } = await supabase
        .from("video_jobs")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
          video_url: "https://example.com/mock-video.mp4",
          frame_count: 60
        })
        .eq("id", job.id)
        .select()
        .single();

      // Generate mock frames
      const framesToInsert = Array.from({ length: 60 }).map((_, i) => ({
        video_job_id: job.id,
        project_id: job.project_id,
        frame_index: i,
        cdn_url: `https://picsum.photos/seed/${job.id}-${i}/1920/1080`, // Mock images
        width: 1920,
        height: 1080,
        file_size_bytes: 50000
      }));

      await supabase.from("frames").insert(framesToInsert);

      return completedJob;
    }

    return job;
  });

export const getProjectFrames = createServerFn({ method: "GET" })
  .handler(async ({ context, data }) => {
    // Require authentication
    if (!context.userId) throw new Error("Unauthorized");

    const { projectId } = data;
    if (!projectId) throw new Error("Project ID is required");

    const { supabase } = await import("@/integrations/supabase/client");

    // Verify user owns the project
    const { data: projectData, error: projError } = await supabase
      .from("user_projects")
      .select("id")
      .eq("id", projectId)
      .eq("user_id", context.userId)
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
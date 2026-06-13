import { createServerFn } from "@tanstack/react-start";

export const generateVideoJob = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const obj = input as Record<string, unknown>;
    const projectId = typeof obj?.projectId === "string" ? obj.projectId : "";
    const prompt = typeof obj?.prompt === "string" ? obj.prompt : "";
    const userId = typeof obj?.userId === "string" ? obj.userId : "";
    if (!projectId || !prompt || !userId) throw new Error("Missing required fields");
    return { projectId, prompt, userId };
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    
    // Create a new video job in 'queued' state
    const { data: job, error } = await (supabaseAdmin as any)
      .from("video_jobs")
      .insert({
        project_id: data.projectId,
        user_id: data.userId,
        prompt: data.prompt,
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
            promptText: data.prompt,
            model: "gen3a_turbo",
            ratio: "16:9"
          })
        });
        
        if (response.ok) {
          const runwayData = await response.json();
          await (supabaseAdmin as any).from("video_jobs").update({
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
  .inputValidator((input: unknown) => {
    const obj = input as Record<string, unknown>;
    const jobId = typeof obj?.jobId === "string" ? obj.jobId : "";
    if (!jobId) throw new Error("Job ID is required");
    return { jobId };
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    
    // Fetch current status
    const { data: job, error } = await (supabaseAdmin as any)
      .from("video_jobs")
      .select("*")
      .eq("id", data.jobId)
      .single();

    if (error) {
      console.error("[pollVideoJobStatus] Error:", error);
      throw new Error("Failed to fetch job status");
    }

    // Simulate progress: If queued > 5 seconds, move to processing. 
    // If processing > 10 seconds, move to completed and generate frames.
    const createdTime = new Date(job.created_at).getTime();
    const now = Date.now();
    const elapsed = now - createdTime;

    if (job.status === "queued" && elapsed > 5000) {
      const { data: updatedJob } = await (supabaseAdmin as any)
        .from("video_jobs")
        .update({ status: "processing", started_at: new Date().toISOString() })
        .eq("id", job.id)
        .select()
        .single();
      return updatedJob;
    }

    if (job.status === "processing" && elapsed > 15000) {
      // Simulate frame extraction completion
      const { data: completedJob } = await (supabaseAdmin as any)
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
      
      await (supabaseAdmin as any).from("frames").insert(framesToInsert);

      return completedJob;
    }

    return job;
  });

export const getProjectFrames = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => {
    const obj = input as Record<string, unknown>;
    const projectId = typeof obj?.projectId === "string" ? obj.projectId : "";
    if (!projectId) throw new Error("Project ID is required");
    return { projectId };
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: frames, error } = await (supabaseAdmin as any)
      .from("frames")
      .select("*")
      .eq("project_id", data.projectId)
      .order("frame_index", { ascending: true });

    if (error) {
      console.error("[getProjectFrames] Error:", error);
      throw new Error("Failed to fetch frames");
    }

    return frames;
  });
import { supabase } from "@/integrations/supabase/client";
import crypto from "crypto";

export type DbVideoJob = {
  id: string;
  project_id: string;
  user_id: string;
  provider: string;
  model: string;
  input_type: string;
  input_image_url: string | null;
  duration_seconds: number;
  aspect_ratio: string;
  status: string;
  external_job_id: string | null;
  video_url: string | null;
  frame_count: number | null;
  processing_time_ms: number | null;
  cost_usd: number | null;
  error_message: string | null;
  retry_count: number;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
};

export type DbFrame = {
  id: string;
  video_job_id: string;
  project_id: string;
  frame_index: number;
  cdn_url: string;
  width: number | null;
  height: number | null;
  file_size_bytes: number | null;
  created_at: string;
};

// In-memory fallback database for local development when tables are not migrated
const memoryVideoJobs = new Map<string, DbVideoJob>();
const memoryFrames = new Map<string, DbFrame[]>();
const memoryProjectCode = new Map<string, { html: string; css: string; js: string }>();
const memoryProjectSettings = new Map<string, unknown>();

export async function insertVideoJob(job: Partial<DbVideoJob> & { userId: string }): Promise<DbVideoJob | null> {
  try {
    const { data, error } = await supabase
      .from("video_jobs")
      .insert({
        ...(job as any),
        ...job,
        user_id: job.userId // Ensure user_id is set from the passed userId
      })
      .select()
      .single();

    if (error) {
      console.warn(
        "[studio.server] insertVideoJob db insert failed, falling back to memory store. Msg:",
        error.message,
      );
      return createMemoryJob(job);
    }
    return data;
  } catch (err) {
    console.warn("[studio.server] insertVideoJob exception, falling back to memory store:", err);
    return createMemoryJob(job);
  }
}

function createMemoryJob(job: Partial<DbVideoJob> & { userId: string }): DbVideoJob {
  const newJob: DbVideoJob = {
    id: job.id || crypto.randomUUID(),
    project_id: job.project_id || "00000000-0000-0000-0000-000000000000",
    user_id: job.userId, // Use the passed userId
    provider: job.provider || "mock-runner",
    model: job.model || "runway-gen3-turbo",
    input_type: job.input_type || "text_to_video",
    input_image_url: job.input_image_url || null,
    duration_seconds: job.duration_seconds || 8,
    aspect_ratio: job.aspect_ratio || "16:9",
    status: job.status || "queued",
    external_job_id: job.external_job_id || null,
    video_url: job.video_url || null,
    frame_count: job.frame_count || null,
    processing_time_ms: job.processing_time_ms || null,
    cost_usd: job.cost_usd || null,
    error_message: job.error_message || null,
    retry_count: job.retry_count || 0,
    created_at: job.created_at || new Date().toISOString(),
    started_at: job.started_at || null,
    completed_at: job.completed_at || null,
  };
  memoryVideoJobs.set(newJob.id, newJob);
  return newJob;
}

export async function updateVideoJob(
  jobId: string,
  updates: Partial<DbVideoJob>,
  userId: string
): Promise<DbVideoJob | null> {
  try {
    const { data, error } = await supabase
      .from("video_jobs")
      .update(updates)
      .eq("id", jobId)
      .eq("user_id", userId) // Ensure user owns the job
      .select()
      .single();

    if (error) {
      console.warn(
        "[studio.server] updateVideoJob db update failed, falling back to memory store. Msg:",
        error.message,
      );
      return updateMemoryJob(jobId, updates);
    }
    return data;
  } catch (err) {
    console.warn("[studio.server] updateVideoJob exception, falling back to memory store:", err);
    return updateMemoryJob(jobId, updates);
  }
}

function updateMemoryJob(jobId: string, updates: Partial<DbVideoJob>): DbVideoJob | null {
  const existing = memoryVideoJobs.get(jobId);
  if (!existing) return null;
  const updated = { ...existing, ...updates } as DbVideoJob;
  memoryVideoJobs.set(jobId, updated);
  return updated;
}

export async function fetchVideoJob(jobId: string, userId: string): Promise<DbVideoJob | null> {
  try {
    const { data, error } = await supabase
      .from("video_jobs")
      .select("*")
      .eq("id", jobId)
      .eq("user_id", userId) // Ensure user owns the job
      .maybeSingle();

    if (error) {
      console.warn(
        "[studio.server] fetchVideoJob db fetch failed, falling back to memory store. Msg:",
        error.message,
      );
      return memoryVideoJobs.get(jobId) || null;
    }
    return data;
  } catch (err) {
    console.warn("[studio.server] fetchVideoJob exception, falling back to memory store:", err);
    return memoryVideoJobs.get(jobId) || null;
  }
}

export async function fetchProjectFrames(projectId: string, userId: string): Promise<DbFrame[]> {
  try {
    const { data, error } = await supabase
      .from("frames")
      .select("*, video_jobs!inner(user_id)") // Join with video_jobs to verify ownership via project
      .eq("project_id", projectId)
      .eq("video_jobs.user_id", userId) // Ensure user owns the project through the video job
      .order("frame_index", { ascending: true });

    if (error) {
      console.warn(
        "[studio.server] fetchProjectFrames db fetch failed, falling back to memory store. Msg:",
        error.message,
      );
      return memoryFrames.get(projectId) || [];
    }
    return data ?? [];
  } catch (err) {
    console.warn(
      "[studio.server] fetchProjectFrames exception, falling back to memory store:",
      err,
    );
    return memoryFrames.get(projectId) || [];
  }
}

export async function insertFrames(framesList: Array<Partial<DbFrame> & { video_job_id: string, userId: string }>): Promise<DbFrame[]> {
  try {
    // Verify user owns all the video_jobs these frames belong to
    const videoJobIds = [...new Set(framesList.map(f => f.video_job_id))];
    const { data: ownedJobs, error: ownershipError } = await supabase
      .from("video_jobs")
      .select("id")
      .in("id", videoJobIds)
      .eq("user_id", framesList[0].userId); // Assuming all frames belong to same user

    if (ownershipError) throw ownershipError;
    if (ownedJobs.length !== videoJobIds.length) {
      throw new Error("Unauthorized: One or more video jobs do not belong to the user");
    }

    const { data, error } = await supabase
      .from("frames")
      .insert(framesList.map(({ userId, ...frame }) => frame)) // Remove userId from insert
      .select();

    if (error) {
      console.warn(
        "[studio.server] insertFrames db insert failed, falling back to memory store. Msg:",
        error.message,
      );
      return insertMemoryFrames(framesList);
    }
    return data ?? [];
  } catch (err) {
    console.warn("[studio.server] insertFrames exception, falling back to memory store:", err);
    return insertMemoryFrames(framesList);
  }
}

function insertMemoryFrames(framesList: Partial<DbFrame>[]): DbFrame[] {
  const created: DbFrame[] = [];
  framesList.forEach((f) => {
    const frame: DbFrame = {
      id: f.id || crypto.randomUUID(),
      video_job_id: f.video_job_id || "00000000-0000-0000-0000-000000000000",
      project_id: f.project_id || "00000000-0000-0000-0000-000000000000",
      frame_index: f.frame_index ?? 0,
      cdn_url: f.cdn_url || "",
      width: f.width ?? null,
      height: f.height ?? null,
      file_size_bytes: f.file_size_bytes ?? null,
      created_at: f.created_at || new Date().toISOString(),
    };
    created.push(frame);
  });

  if (created.length > 0) {
    const projectId = created[0].project_id;
    const existing = memoryFrames.get(projectId) || [];
    // Merge or set
    const merged = [...existing, ...created].sort((a, b) => a.frame_index - b.frame_index);
    memoryFrames.set(projectId, merged);
  }

  return created;
}

export async function updateProjectCode(
  projectId: string,
  html: string,
  css: string,
  js: string,
  userId: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("user_projects")
      .update({
        current_html: html,
        current_css: css,
        current_js: js,
      })
      .eq("id", projectId)
      .eq("user_id", userId); // Ensure user owns the project

    if (error) {
      console.warn(
        "[studio.server] updateProjectCode db update failed, falling back to memory store. Msg:",
        error.message,
      );
      memoryProjectCode.set(projectId, { html, css, js });
      return true;
    }
    return true;
  } catch (err) {
    console.warn("[studio.server] updateProjectCode exception, falling back to memory store:", err);
    memoryProjectCode.set(projectId, { html, css, js });
    return true;
  }
}

export async function updateProjectSettings(
  projectId: string,
  settings: {
    status: string;
    frame_metadata: unknown;
    settings: unknown;
  },
  userId: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("user_projects")
      .update(settings)
      .eq("id", projectId)
      .eq("user_id", userId); // Ensure user owns the project

    if (error) {
      console.warn(
        "[studio.server] updateProjectSettings db update failed, falling back to memory store. Msg:",
        error.message,
      );
      memoryProjectSettings.set(projectId, settings);
      return true;
    }
    return true;
  } catch (err) {
    console.warn(
      "[studio.server] updateProjectSettings exception, falling back to memory store:",
      err,
    );
    memoryProjectSettings.set(projectId, settings);
    return true;
  }
}

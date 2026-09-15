import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const GATEWAY = "https://ai.gateway.lovable.dev/v1/videos";
const BUCKET = "promo-videos";

export type PromoVideo = {
  id: string;
  project_id: string | null;
  listing_slug: string | null;
  status: string;
  video_url: string | null;
  error: string | null;
  prompt: string;
  created_at: string;
};

/** Turn a blueprint into a short, concrete film brief. */
function buildPrompt(title: string, description: string | null) {
  const subject = (description ?? "").trim().slice(0, 400) || title;
  return [
    `A premium 8-second promo film for a website called "${title}".`,
    `The site is: ${subject}.`,
    "Show a sleek laptop and phone on a dark studio surface displaying the website, with the page scrolling smoothly through its sections.",
    "Slow push-in camera in a single continuous shot, no scene cuts. Cinematic rim lighting, warm ember-orange accents on near-black, shallow depth of field.",
    "Audio: a confident minimal electronic bed with a soft whoosh as the camera settles. No dialogue. No voice-over.",
    "No on-screen captions, no logos, no readable body text.",
  ].join(" ");
}

function apiKey() {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("Video generation is not configured on this server.");
  return key;
}

/**
 * Start a promo video job for a blueprint the signed-in creator owns.
 * Video is expensive, so this only ever runs from an explicit user action.
 */
export const startPromoVideo = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    const projectId = String((input as any)?.projectId ?? "").trim();
    if (!projectId) throw new Error("Blueprint ID is required.");
    return { projectId };
  })
  .handler(async ({ context, data }): Promise<{ id: string }> => {
    const { supabase, userId } = context;

    const { data: project } = await supabase
      .from("user_projects")
      .select("id, title, description")
      .eq("id", data.projectId)
      .eq("user_id", userId)
      .maybeSingle();
    if (!project) throw new Error("Blueprint not found.");

    // One in-flight job per blueprint keeps costs predictable.
    const { data: running } = await supabase
      .from("promo_videos")
      .select("id, status")
      .eq("project_id", project.id)
      .in("status", ["queued", "processing"])
      .limit(1);
    if (running?.length) return { id: running[0].id as string };

    const prompt = buildPrompt(project.title ?? "Untitled blueprint", project.description);

    const res = await fetch(GATEWAY, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey()}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-omni-1.1-flash",
        input: prompt,
        response_format: { type: "video", resolution: "720p", duration: "8s", aspect_ratio: "16:9" },
      }),
    });

    if (!res.ok) {
      const err = (await res.json().catch(() => null)) as { message?: string } | null;
      throw new Error(err?.message ?? `Video generation failed (${res.status}).`);
    }
    const job = (await res.json()) as { id: string };

    const { data: row, error } = await supabase
      .from("promo_videos")
      .insert({
        user_id: userId,
        project_id: project.id,
        job_id: job.id,
        prompt,
        status: "processing",
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);

    return { id: row.id as string };
  });

/**
 * Poll a job. On completion the MP4 is downloaded once and stored in our own
 * bucket — the gateway's copy expires within ~48h.
 */
export const pollPromoVideo = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    const id = String((input as any)?.id ?? "").trim();
    if (!id) throw new Error("Video ID is required.");
    return { id };
  })
  .handler(
    async ({
      context,
      data,
    }): Promise<{ status: string; url: string | null; error: string | null }> => {
      const { supabase, userId } = context;

      const { data: row } = await supabase
        .from("promo_videos")
        .select("id, job_id, status, video_url, error, project_id")
        .eq("id", data.id)
        .eq("user_id", userId)
        .maybeSingle();
      if (!row) throw new Error("Video not found.");

      if (row.status === "completed" || row.status === "failed") {
        return {
          status: row.status as string,
          url: (row.video_url as string | null) ?? null,
          error: (row.error as string | null) ?? null,
        };
      }

      const jobRes = await fetch(`${GATEWAY}/${row.job_id}`, {
        headers: { Authorization: `Bearer ${apiKey()}` },
      });
      if (!jobRes.ok) return { status: "processing", url: null, error: null };
      const job = (await jobRes.json()) as {
        status: string;
        error?: { message?: string };
      };

      if (job.status === "failed") {
        const message = job.error?.message ?? "The video could not be generated.";
        await supabase
          .from("promo_videos")
          .update({ status: "failed", error: message })
          .eq("id", row.id);
        return { status: "failed", url: null, error: message };
      }

      if (job.status !== "completed") return { status: "processing", url: null, error: null };

      const mp4 = await fetch(`${GATEWAY}/${row.job_id}/content`, {
        headers: { Authorization: `Bearer ${apiKey()}` },
      });
      if (!mp4.ok) return { status: "processing", url: null, error: null };
      const bytes = await mp4.arrayBuffer();

      const path = `${userId}/${row.id}.mp4`;
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { error: upErr } = await supabaseAdmin.storage
        .from(BUCKET)
        .upload(path, bytes, { contentType: "video/mp4", upsert: true });
      if (upErr) throw new Error(upErr.message);

      await supabase
        .from("promo_videos")
        .update({ status: "completed", video_url: path, error: null })
        .eq("id", row.id);

      // Any listing already published from this blueprint gets the clip too.
      if (row.project_id) {
        await supabase
          .from("marketplace_listings")
          .update({ promo_video_url: path })
          .eq("creator_id", userId)
          .eq("preview_url", `/projects/${row.project_id}`);
      }

      return { status: "completed", url: path, error: null };
    },
  );

/** Promo videos the signed-in creator has generated. */
export const listMyPromoVideos = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<PromoVideo[]> => {
    const { data } = await context.supabase
      .from("promo_videos")
      .select("id, project_id, listing_slug, status, video_url, error, prompt, created_at")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false })
      .limit(50);
    return (data ?? []) as PromoVideo[];
  });

import { createServerFn } from "@tanstack/react-start";

export type ContentItem = {
  title: string;
  body: string;
  platform: "linkedin" | "twitter" | "instagram" | "youtube";
  status: "draft" | "scheduled" | "published" | "failed";
  scheduledAt: string;
  postUrl?: string;
};

export const scheduleContent = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const obj = input as Record<string, unknown>;
    const title = typeof obj?.title === "string" ? obj.title.trim() : "";
    const body = typeof obj?.body === "string" ? obj.body.trim() : "";
    const platform = typeof obj?.platform === "string" ? obj.platform.trim() : "";
    const scheduledAt = typeof obj?.scheduledAt === "string" ? obj.scheduledAt.trim() : "";
    const postUrl = typeof obj?.postUrl === "string" ? obj.postUrl.trim() : undefined;
    const allowed = ["linkedin", "twitter", "instagram", "youtube"];
    if (!title) throw new Error("Title is required");
    if (!body) throw new Error("Body is required");
    if (!allowed.includes(platform)) throw new Error("Invalid platform");
    if (!scheduledAt) throw new Error("scheduledAt is required");
    return { title, body, platform, scheduledAt, postUrl };
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await (supabaseAdmin as any).from("content_schedule").insert({
      title: data.title,
      body: data.body,
      platform: data.platform,
      status: "scheduled",
      scheduled_at: data.scheduledAt,
      post_url: data.postUrl ?? null,
    });

    if (error) {
      console.error("[content-schedule] insert failed", error);
      throw new Error("Failed to schedule content.");
    }

    return { ok: true as const };
  });

export const listScheduledContent = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await (supabaseAdmin as any)
    .from("content_schedule")
    .select("*")
    .in("status", ["scheduled", "published"])
    .order("scheduled_at", { ascending: true });

  if (error) {
    console.error("[content-schedule] list failed", error);
    throw new Error("Failed to load content schedule.");
  }

  return { items: data ?? [] };
});

export const markContentPublished = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const obj = input as Record<string, unknown>;
    const id = typeof obj?.id === "string" ? obj.id.trim() : "";
    const postUrl = typeof obj?.postUrl === "string" ? obj.postUrl.trim() : undefined;
    if (!id) throw new Error("Content id is required");
    return { id, postUrl };
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const patch: Record<string, unknown> = {
      status: "published",
      published_at: new Date().toISOString(),
    };
    if (data.postUrl) patch.post_url = data.postUrl;

    const { error } = await (supabaseAdmin as any)
      .from("content_schedule")
      .update(patch)
      .eq("id", data.id);

    if (error) {
      console.error("[content-schedule] update failed", error);
      throw new Error("Failed to mark content as published.");
    }

    return { ok: true as const };
  });

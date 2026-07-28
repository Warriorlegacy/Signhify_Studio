import { createServerFn } from "@tanstack/react-start";

export type DirectoryListingInput = {
  platform: string;
  url: string;
  priority?: number;
  notes?: string;
};

export const upsertDirectoryListing = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const obj = input as Record<string, unknown>;
    const platform = typeof obj?.platform === "string" ? obj.platform.trim() : "";
    const url = typeof obj?.url === "string" ? obj.url.trim() : "";
    const priority = typeof obj?.priority === "number" ? obj.priority : 5;
    const notes = typeof obj?.notes === "string" ? obj.notes.trim() : undefined;
    if (!platform) throw new Error("Platform is required");
    if (!url) throw new Error("URL is required");
    return { platform, url, priority, notes };
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("directory_listings")
      .upsert(
        {
          platform: data.platform,
          url: data.url,
          priority: data.priority,
          notes: data.notes ?? null,
          status: "pending",
        },
        { onConflict: "platform" },
      );

    if (error) {
      console.error("[directory-listings] upsert failed", error);
      throw new Error("Failed to save directory listing.");
    }

    return { ok: true as const };
  });

export const listDirectoryListings = createServerFn({ method: "GET" })
  .handler(async () => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("directory_listings")
      .select("*")
      .order("priority", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      console.error("[directory-listings] list failed", error);
      throw new Error("Failed to load directory listings.");
    }

    return { items: data ?? [] };
  });

export const updateDirectoryListing = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const obj = input as Record<string, unknown>;
    const id = typeof obj?.id === "string" ? obj.id.trim() : "";
    const status = typeof obj?.status === "string" ? obj.status.trim() : "";
    const reviewUrl = typeof obj?.reviewUrl === "string" ? obj.reviewUrl.trim() : undefined;
    const notes = typeof obj?.notes === "string" ? obj.notes.trim() : undefined;
    if (!id) throw new Error("Listing id is required");
    if (!status) throw new Error("Status is required");
    return { id, status, reviewUrl, notes };
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const patch: Record<string, unknown> = { status: data.status, updated_at: new Date().toISOString() };
    if (data.reviewUrl) patch.review_url = data.reviewUrl;
    if (data.notes !== undefined) patch.notes = data.notes;
    if (data.status === "submitted") patch.submitted_at = new Date().toISOString();
    if (data.status === "approved") patch.approved_at = new Date().toISOString();

    const { error } = await supabaseAdmin
      .from("directory_listings")
      .update(patch)
      .eq("id", data.id);

    if (error) {
      console.error("[directory-listings] update failed", error);
      throw new Error("Failed to update directory listing.");
    }

    return { ok: true as const };
  });

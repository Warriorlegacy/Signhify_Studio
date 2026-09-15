import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// Public/creator-facing columns only. asset_path and stripe_connect_account_id are
// excluded here; they are fetched through service_role in verified purchase/download flows.
const LISTING_COLS =
  "id, slug, title, description, category, price_cents, preview_url, creator_id, created_at, is_active, status, review_note";

export const getCreatorListings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { userId, supabase } = context;
    const { data } = await (supabase.from as any)("marketplace_listings")
      .select(LISTING_COLS)
      .eq("creator_id", userId)
      .order("created_at", { ascending: false });
    return (data ?? []) as any[];
  });

export const updateListingStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    const { id, status } = input as any;
    if (!id) throw new Error("Listing ID required");
    if (!["draft", "published", "archived"].includes(status)) throw new Error("Invalid status");
    return { id, status };
  })
  .handler(async ({ context, data }) => {
    const { userId, supabase } = context;
    // `status` column may not exist on marketplace_listings in this schema — soft update.
    const { error } = await (supabase.from as any)("marketplace_listings")
      .update({ status: data.status } as any)
      .eq("id", data.id)
      .eq("creator_id", userId);
    if (error) throw new Error(error.message);
    return { success: true };
  });

export const getUserPurchases = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { userId, supabase } = context;
    const { data } = await (supabase.from as any)("marketplace_purchases")
      .select(
        `id, listing_id, purchased_at, stripe_session_id, listing:marketplace_listings(${LISTING_COLS})`,
      )
      .eq("user_id", userId)
      .order("purchased_at", { ascending: false });
    return (data ?? []) as any[];
  });

/** Update a listing the signed-in creator owns. */
export const updateListing = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    const o = (input ?? {}) as Record<string, unknown>;
    const id = String(o.id ?? "");
    if (!id) throw new Error("Listing ID required");
    const patch: Record<string, unknown> = {};
    if (typeof o.title === "string") {
      if (!o.title.trim()) throw new Error("Title cannot be empty.");
      patch.title = o.title.trim().slice(0, 120);
    }
    if (typeof o.description === "string") patch.description = o.description.trim().slice(0, 2000);
    if (typeof o.category === "string") patch.category = o.category.trim().slice(0, 60);
    if (typeof o.preview_url === "string") patch.preview_url = o.preview_url.trim().slice(0, 500);
    if (o.price_cents !== undefined && o.price_cents !== null) {
      const cents = Math.round(Number(o.price_cents));
      if (!Number.isFinite(cents) || cents < 0 || cents > 10_000_00) {
        throw new Error("Price must be between $0 and $10,000.");
      }
      patch.price_cents = cents;
    }
    if (typeof o.is_active === "boolean") patch.is_active = o.is_active;
    if (Object.keys(patch).length === 0) throw new Error("Nothing to update.");
    return { id, patch };
  })
  .handler(async ({ context, data }) => {
    const { userId, supabase } = context;
    const { error } = await (supabase.from as any)("marketplace_listings")
      .update(data.patch)
      .eq("id", data.id)
      .eq("creator_id", userId);
    if (error) throw new Error(error.message);
    return { success: true };
  });

/** Permanently remove a listing the signed-in creator owns. */
export const deleteListing = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    const id = String((input as any)?.id ?? "");
    if (!id) throw new Error("Listing ID required");
    return { id };
  })
  .handler(async ({ context, data }) => {
    const { userId, supabase } = context;
    const { error } = await (supabase.from as any)("marketplace_listings")
      .delete()
      .eq("id", data.id)
      .eq("creator_id", userId);
    if (error) throw new Error(error.message);
    return { success: true };
  });

/**
 * Create a marketplace listing from a blueprint the signed-in creator owns.
 * Listings enter review as `pending` and only go public once approved.
 */
export const createListingFromProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    const o = (input ?? {}) as Record<string, unknown>;
    const projectId = String(o.projectId ?? "").trim();
    if (!projectId) throw new Error("Pick a blueprint to list.");
    const title = String(o.title ?? "").trim();
    if (title.length < 3) throw new Error("Give your listing a title.");
    const description = String(o.description ?? "").trim();
    if (description.length < 20) throw new Error("Add a description of at least 20 characters.");
    const category = String(o.category ?? "Template").trim().slice(0, 60) || "Template";
    const cents = Math.round(Number(o.price_cents ?? 0));
    if (!Number.isFinite(cents) || cents < 0 || cents > 10_000_00) {
      throw new Error("Price must be between $0 and $10,000.");
    }
    return {
      projectId,
      title: title.slice(0, 120),
      description: description.slice(0, 2000),
      category,
      price_cents: cents,
    };
  })
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;

    const { data: project } = await supabase
      .from("user_projects")
      .select("id, title")
      .eq("id", data.projectId)
      .eq("user_id", userId)
      .maybeSingle();
    if (!project) throw new Error("Blueprint not found.");

    const baseSlug = `template-${project.id.slice(0, 8)}`;
    const { data: existing } = await supabase
      .from("marketplace_listings")
      .select("slug")
      .like("slug", `${baseSlug}%`);
    const slug = existing?.length ? `${baseSlug}-${existing.length + 1}` : baseSlug;

    // Carry over a promo video already generated for this blueprint.
    const { data: promo } = await supabase
      .from("promo_videos")
      .select("video_url")
      .eq("user_id", userId)
      .eq("project_id", project.id)
      .eq("status", "completed")
      .order("created_at", { ascending: false })
      .limit(1);

    const { data: inserted, error } = await supabase
      .from("marketplace_listings")
      .insert([
        {
          slug,
          title: data.title,
          description: data.description,
          category: data.category,
          price_cents: data.price_cents,
          preview_url: `/projects/${project.id}`,
          asset_path: null,
          promo_video_url: promo?.[0]?.video_url ?? null,
          status: "pending",
          is_active: false,
          creator_id: userId,
        },
      ])
      .select("id, slug, title")
      .single();

    if (error) {
      throw new Error(
        error.code === "23505"
          ? "A listing with that address already exists."
          : `Could not create the listing: ${error.message}`,
      );
    }

    return { success: true as const, listing: inserted };
  });

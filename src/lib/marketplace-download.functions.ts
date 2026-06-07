import { createServerFn } from "@tanstack/react-start";

export const downloadAsset = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const listingId = (input as any)?.listingId;
    if (typeof listingId !== "string" || !listingId) throw new Error("listingId is required");
    return { listingId };
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: listing, error } = await (supabaseAdmin.from as any)("marketplace_listings").select("price_cents, asset_path").eq("id", data.listingId).maybeSingle();
    if (error || !listing) throw new Error("Listing not found.");
    if ((listing.price_cents ?? 0) !== 0) throw new Error("This asset requires checkout.");
    if (!listing.asset_path) throw new Error("No asset is attached to this listing yet.");
    const { data: signed, error: signError } = await supabaseAdmin.storage.from("marketplace-assets").createSignedUrl(listing.asset_path, 3600);
    if (signError || !signed?.signedUrl) throw new Error("Could not create a signed download URL.");
    return { signedUrl: signed.signedUrl as string };
  });

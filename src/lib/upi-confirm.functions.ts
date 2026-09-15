import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * UPI confirmation rail.
 *
 * Two flows live here and both settle without any manual step in the inbox:
 *  - a buyer confirms a UPI transfer for a blueprint -> the blueprint unlocks
 *  - a creator confirms the UPI listing fee -> their pending listing goes live
 *
 * Both write through the admin client *after* verifying the caller, because
 * purchases and listing approval are privileged rows users cannot write directly.
 */

const emailOf = (context: any): string | null => (context?.claims as any)?.email ?? null;

const cleanRef = (value: unknown): string => {
  const ref = String(value ?? "").trim();
  if (ref.length < 4) throw new Error("Enter the UPI transaction reference (at least 4 characters).");
  return ref.slice(0, 120);
};

/** Buyer confirms a UPI transfer for a blueprint; the unlock happens immediately. */
export const confirmUpiPurchase = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    const o = (input ?? {}) as Record<string, unknown>;
    const slug = String(o.slug ?? "").trim();
    if (!slug) throw new Error("Blueprint is required.");
    const amount = typeof o.amount === "number" && o.amount >= 0 ? o.amount : 0;
    return { slug, amount, transactionRef: cleanRef(o.transactionRef) };
  })
  .handler(async ({ context, data }) => {
    const { userId } = context;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: listing, error: listingErr } = await (supabaseAdmin.from as any)(
      "marketplace_listings",
    )
      .select("id, slug, title, price_cents")
      .eq("slug", data.slug)
      .maybeSingle();
    if (listingErr) throw new Error(listingErr.message);
    if (!listing) throw new Error("That blueprint no longer exists.");

    const amount = data.amount || (listing.price_cents ?? 0) / 100;

    const { error: payErr } = await (supabaseAdmin.from as any)("manual_payments").insert({
      user_id: userId,
      listing_id: listing.id,
      kind: "purchase",
      amount,
      currency: "INR",
      method: "upi",
      description: `Blueprint — ${listing.title}`,
      transaction_ref: data.transactionRef,
      status: "confirmed",
      confirmed_at: new Date().toISOString(),
    });
    if (payErr) throw new Error(payErr.message);

    // Unlock once; repeat confirmations must not duplicate the purchase.
    const { data: existing } = await (supabaseAdmin.from as any)("marketplace_purchases")
      .select("id")
      .eq("listing_id", listing.id)
      .eq("user_id", userId)
      .maybeSingle();

    if (!existing) {
      const { error: buyErr } = await (supabaseAdmin.from as any)("marketplace_purchases").insert({
        listing_id: listing.id,
        user_id: userId,
        stripe_session_id: `upi:${data.transactionRef}`,
      });
      if (buyErr) throw new Error(buyErr.message);
    }

    try {
      const { notifyManualPayment } = await import("./notifications.server");
      await notifyManualPayment({
        email: emailOf(context) ?? userId,
        amount,
        currency: "INR",
        method: "upi",
        description: `Blueprint unlocked — ${listing.title}`,
        transactionRef: data.transactionRef,
      });
    } catch {
      // Never block an unlock on a notification failure.
    }

    return {
      unlocked: true as const,
      listing: { slug: listing.slug, title: listing.title as string },
      transactionRef: data.transactionRef,
    };
  });

/** Creator confirms the UPI listing fee; their pending listing is approved automatically. */
export const confirmListingFeeUpi = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    const o = (input ?? {}) as Record<string, unknown>;
    const id = String(o.id ?? "").trim();
    if (!id) throw new Error("Listing is required.");
    const amount = typeof o.amount === "number" && o.amount > 0 ? o.amount : 99;
    return { id, amount, transactionRef: cleanRef(o.transactionRef) };
  })
  .handler(async ({ context, data }) => {
    const { userId } = context;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: listing, error: listingErr } = await (supabaseAdmin.from as any)(
      "marketplace_listings",
    )
      .select("id, slug, title, creator_id, status")
      .eq("id", data.id)
      .maybeSingle();
    if (listingErr) throw new Error(listingErr.message);
    if (!listing) throw new Error("That listing no longer exists.");
    if (listing.creator_id !== userId) throw new Error("This listing is not yours.");

    if (listing.status === "live") {
      return { status: "live" as const, slug: listing.slug as string, alreadyLive: true as const };
    }

    const { error: payErr } = await (supabaseAdmin.from as any)("manual_payments").insert({
      user_id: userId,
      listing_id: listing.id,
      kind: "listing_fee",
      amount: data.amount,
      currency: "INR",
      method: "upi",
      description: `Listing fee — ${listing.title}`,
      transaction_ref: data.transactionRef,
      status: "confirmed",
      confirmed_at: new Date().toISOString(),
    });
    if (payErr) throw new Error(payErr.message);

    const { error: updErr } = await (supabaseAdmin.from as any)("marketplace_listings")
      .update({
        status: "live",
        is_active: true,
        reviewed_at: new Date().toISOString(),
        review_note: `Auto-approved on UPI confirmation (ref ${data.transactionRef}).`,
      })
      .eq("id", listing.id);
    if (updErr) throw new Error(updErr.message);

    try {
      const { notifyManualPayment } = await import("./notifications.server");
      await notifyManualPayment({
        email: emailOf(context) ?? userId,
        amount: data.amount,
        currency: "INR",
        method: "upi",
        description: `Listing auto-approved — ${listing.title}`,
        transactionRef: data.transactionRef,
      });
    } catch {
      // Notification failures never block going live.
    }

    return { status: "live" as const, slug: listing.slug as string, alreadyLive: false as const };
  });

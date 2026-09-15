import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Creator earnings + withdrawals on the UPI rail.
 *
 * Earnings are derived from confirmed manual_payments of kind "purchase" that point
 * at a listing the caller owns. The platform keeps a flat commission; the rest is
 * the creator's balance, minus anything already requested or paid out.
 */

export const CREATOR_SHARE = 0.85;

export type ListingEarning = {
  listingId: string;
  slug: string;
  title: string;
  status: string;
  sales: number;
  grossInr: number;
  netInr: number;
  lastSaleAt: string | null;
};

export type PayoutRequestRow = {
  id: string;
  amount_inr: number;
  upi_id: string;
  status: string;
  note: string | null;
  created_at: string;
  paid_at: string | null;
};

const round2 = (n: number) => Math.round(n * 100) / 100;

export const getCreatorEarnings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { userId } = context;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: listings, error: listErr } = await (supabaseAdmin.from as any)(
      "marketplace_listings",
    )
      .select("id, slug, title, status")
      .eq("creator_id", userId);
    if (listErr) throw new Error(listErr.message);

    const rows = (listings ?? []) as Array<{
      id: string;
      slug: string;
      title: string;
      status: string | null;
    }>;

    let payments: Array<{ listing_id: string; amount: number; confirmed_at: string | null }> = [];
    if (rows.length) {
      const { data: pay, error: payErr } = await (supabaseAdmin.from as any)("manual_payments")
        .select("listing_id, amount, confirmed_at, created_at")
        .eq("kind", "purchase")
        .eq("status", "confirmed")
        .in(
          "listing_id",
          rows.map((r) => r.id),
        );
      if (payErr) throw new Error(payErr.message);
      payments = (pay ?? []).map((p: any) => ({
        listing_id: p.listing_id,
        amount: Number(p.amount) || 0,
        confirmed_at: p.confirmed_at ?? p.created_at ?? null,
      }));
    }

    const earnings: ListingEarning[] = rows.map((l) => {
      const mine = payments.filter((p) => p.listing_id === l.id);
      const gross = mine.reduce((s, p) => s + p.amount, 0);
      const last = mine
        .map((p) => p.confirmed_at)
        .filter(Boolean)
        .sort()
        .pop();
      return {
        listingId: l.id,
        slug: l.slug,
        title: l.title,
        status: (l.status ?? "pending").toLowerCase(),
        sales: mine.length,
        grossInr: round2(gross),
        netInr: round2(gross * CREATOR_SHARE),
        lastSaleAt: last ?? null,
      };
    });
    earnings.sort((a, b) => b.netInr - a.netInr);

    const { data: requests, error: reqErr } = await (supabaseAdmin.from as any)("payout_requests")
      .select("id, amount_inr, upi_id, status, note, created_at, paid_at")
      .eq("creator_id", userId)
      .order("created_at", { ascending: false });
    if (reqErr) throw new Error(reqErr.message);

    const payoutRequests = ((requests ?? []) as PayoutRequestRow[]).map((r) => ({
      ...r,
      amount_inr: Number(r.amount_inr) || 0,
    }));

    const lifetimeNet = round2(earnings.reduce((s, e) => s + e.netInr, 0));
    const withdrawn = round2(
      payoutRequests
        .filter((r) => r.status === "paid")
        .reduce((s, r) => s + r.amount_inr, 0),
    );
    const pendingOut = round2(
      payoutRequests
        .filter((r) => r.status === "requested")
        .reduce((s, r) => s + r.amount_inr, 0),
    );

    return {
      earnings,
      payoutRequests,
      totals: {
        grossInr: round2(earnings.reduce((s, e) => s + e.grossInr, 0)),
        lifetimeNet,
        withdrawn,
        pendingOut,
        availableInr: Math.max(0, round2(lifetimeNet - withdrawn - pendingOut)),
        sales: earnings.reduce((s, e) => s + e.sales, 0),
      },
      creatorShare: CREATOR_SHARE,
    };
  });

export const requestPayout = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    const o = (input ?? {}) as Record<string, unknown>;
    const amount = Number(o.amountInr);
    if (!Number.isFinite(amount) || amount <= 0) throw new Error("Enter an amount to withdraw.");
    const upiId = String(o.upiId ?? "").trim();
    if (upiId.length < 5 || !upiId.includes("@")) throw new Error("Enter a valid UPI ID.");
    return {
      amountInr: round2(amount),
      upiId: upiId.slice(0, 120),
      note: String(o.note ?? "").trim().slice(0, 300),
    };
  })
  .handler(async ({ context, data }) => {
    const { userId } = context;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Recompute the available balance server-side; never trust the client figure.
    const { data: listings } = await (supabaseAdmin.from as any)("marketplace_listings")
      .select("id")
      .eq("creator_id", userId);
    const ids = ((listings ?? []) as any[]).map((l) => l.id);
    let gross = 0;
    if (ids.length) {
      const { data: pay } = await (supabaseAdmin.from as any)("manual_payments")
        .select("amount")
        .eq("kind", "purchase")
        .eq("status", "confirmed")
        .in("listing_id", ids);
      gross = ((pay ?? []) as any[]).reduce((s, p) => s + (Number(p.amount) || 0), 0);
    }
    const { data: reqs } = await (supabaseAdmin.from as any)("payout_requests")
      .select("amount_inr, status")
      .eq("creator_id", userId);
    const claimed = ((reqs ?? []) as any[])
      .filter((r) => r.status === "paid" || r.status === "requested")
      .reduce((s, r) => s + (Number(r.amount_inr) || 0), 0);
    const available = Math.max(0, round2(gross * CREATOR_SHARE - claimed));

    if (data.amountInr > available) {
      throw new Error(`You can withdraw up to ₹${available.toFixed(2)} right now.`);
    }

    const { data: row, error } = await (supabaseAdmin.from as any)("payout_requests")
      .insert({
        creator_id: userId,
        amount_inr: data.amountInr,
        upi_id: data.upiId,
        note: data.note || null,
        status: "requested",
      })
      .select("id, amount_inr, upi_id, status, note, created_at, paid_at")
      .single();
    if (error) throw new Error(error.message);

    try {
      const { notifyManualPayment } = await import("./notifications.server");
      await notifyManualPayment({
        email: ((context as any)?.claims?.email as string) ?? userId,
        amount: data.amountInr,
        currency: "INR",
        method: "upi-payout",
        description: `Creator withdrawal requested to ${data.upiId}`,
        transactionRef: row.id,
      });
    } catch {
      // A withdrawal request must never fail because the notification did.
    }

    return { request: { ...row, amount_inr: Number(row.amount_inr) || 0 } as PayoutRequestRow };
  });

// marketplace-connect.functions.ts — Stripe Connect server functions for creators
import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { STRIPE_CONNECT } from "./stripe-connect.server";
import logger from "./logger";

// ─── Connect / Onboarding ──────────────────────────────────────────────

/** Get the creator's Stripe Connect account status */
export const getConnectStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: profile } = await (supabase.from as any)("profiles")
      .select("stripe_connect_account_id, stripe_connect_onboarding_complete, email")
      .eq("id", userId)
      .maybeSingle();

    return {
      hasAccount: !!profile?.stripe_connect_account_id,
      accountId: profile?.stripe_connect_account_id ?? null,
      onboardingComplete: !!profile?.stripe_connect_onboarding_complete,
      email: profile?.email ?? null,
    };
  });

/** Create a Stripe Connect Express account for the current user */
export const createConnectAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { userId, supabase } = context;

    const { data: userRes } = await supabase.auth.getUser();
    const email = userRes?.user?.email;
    if (!email) throw new Error("User email is required to create a Stripe Connect account.");

    const account = await STRIPE_CONNECT.createAccount(email);

    await (supabaseAdmin.from as any)("profiles")
      .update({ stripe_connect_account_id: account.id } as any)
      .eq("id", userId);

    logger.info(`[marketplace-connect] Created connect account ${account.id} for user ${userId}`);
    return { accountId: account.id };
  });

/** Get the onboarding link for the creator's Connect account */
export const getOnboardingLink = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    const accountId = String((input as any)?.accountId ?? "").trim();
    if (!accountId) throw new Error("accountId is required");
    return { accountId };
  })
  .handler(async ({ data }) => {
    const { SITE_URL: site } = await import("@/lib/site-url");
    const url = await STRIPE_CONNECT.getAccountLink(
      data.accountId,
      `${site}/app/marketplace/sell?connect=refresh`,
      `${site}/app/marketplace/sell?connect=return`,
    );
    return { url };
  });

/** Get the login link for an existing Connect account (dashboard) */
export const getLoginLink = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    const accountId = String((input as any)?.accountId ?? "").trim();
    if (!accountId) throw new Error("accountId is required");
    return { accountId };
  })
  .handler(async ({ data }) => {
    const url = await STRIPE_CONNECT.getLoginLink(data.accountId);
    return { url };
  });

/** Mark onboarding as complete (called after return from Stripe) */
export const confirmOnboardingComplete = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { userId, supabase } = context;

    const { data: profile } = await (supabase.from as any)("profiles")
      .select("stripe_connect_account_id")
      .eq("id", userId)
      .maybeSingle();

    if (!profile?.stripe_connect_account_id) throw new Error("No Connect account found.");

    // Verify the account is fully onboarded (charges_enabled)
    const account = await STRIPE_CONNECT.getAccount(profile.stripe_connect_account_id);
    const complete = account.charges_enabled && account.details_submitted;

    await (supabaseAdmin.from as any)("profiles")
      .update({ stripe_connect_onboarding_complete: complete } as any)
      .eq("id", userId);

    return { onboardingComplete: complete };
  });

// ─── Listings ──────────────────────────────────────────────────────────

export const createListing = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    const d = input as Record<string, unknown>;
    if (!d.name || !d.price_cents) throw new Error("name and price_cents are required");
    return {
      name: String(d.name).trim(),
      description: String(d.description ?? "").trim(),
      category: String(d.category ?? "Template").trim() as
        | "Template"
        | "Agent"
        | "Component"
        | "Workflow",
      price_cents: Number(d.price_cents),
      tags_raw: String(d.tags_raw ?? "").trim(),
      image_url: String(d.image_url ?? "").trim(),
    };
  })
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;

    // Fetch the creator's Stripe Connect account
    const { data: profile } = await (supabase.from as any)("profiles")
      .select("stripe_connect_account_id")
      .eq("id", userId)
      .maybeSingle();

    if (!profile?.stripe_connect_account_id) {
      throw new Error("You must connect Stripe before listing items.");
    }

    const slug = `${data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")}-${Date.now().toString(36)}`;

    const { data: row, error } = await (supabase.from as any)("marketplace_listings")
      .insert({
        slug,
        title: data.name,
        description: data.description || null,
        category: data.category,
        price_cents: data.price_cents,
        preview_url: data.image_url || null,
        creator_id: userId,
        stripe_connect_account_id: profile.stripe_connect_account_id,
        is_active: true,
      })
      .select("id, slug, title, price_cents, created_at")
      .single();

    if (error) {
      logger.error(`[marketplace-connect] Failed to create listing: ${error.message}`);
      throw new Error("Failed to create listing.");
    }

    return { listing: row };
  });

export const deleteListing = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    const id = String((input as any)?.id ?? "").trim();
    if (!id) throw new Error("Listing ID is required");
    return { id };
  })
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const { error } = await (supabase.from as any)("marketplace_listings")
      .update({ is_active: false } as any)
      .eq("id", data.id)
      .eq("creator_id", userId);
    if (error) {
      logger.error(`[marketplace-connect] Failed to deactivate listing: ${error.message}`);
      throw new Error("Failed to deactivate listing.");
    }
    return { success: true };
  });

// ─── Earnings ──────────────────────────────────────────────────────────

export const getCreatorEarnings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const { data: payouts, error } = await (supabase.from as any)("creator_payouts")
      .select("gross_amount_cents, commission_cents, net_amount_cents, status, created_at")
      .eq("creator_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      logger.error(`[marketplace-connect] Failed to fetch payouts: ${error.message}`);
      return { totalSales: 0, pendingPayouts: 0, totalEarned: 0, payouts: [] };
    }

    const totalSales = (payouts ?? []).reduce((s: number, p: any) => s + p.gross_amount_cents, 0);
    const pendingPayouts = (payouts ?? [])
      .filter((p: any) => p.status === "pending")
      .reduce((s: number, p: any) => s + p.net_amount_cents, 0);
    const totalEarned = (payouts ?? [])
      .filter((p: any) => p.status === "paid")
      .reduce((s: number, p: any) => s + p.net_amount_cents, 0);

    return {
      totalSales: Math.round(totalSales / 100),
      pendingPayouts: Math.round(pendingPayouts / 100),
      totalEarned: Math.round(totalEarned / 100),
      payouts: payouts ?? [],
    };
  });

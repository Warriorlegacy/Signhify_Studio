// stripe-connect.server.ts — Stripe Connect Express helpers (server-only)
import Stripe from "stripe";
import logger from "./logger";

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Missing STRIPE_SECRET_KEY.");
  return new Stripe(key);
}

export const STRIPE_CONNECT = {
  /** Signhify commission percentage on each marketplace sale */
  appFeePercent: 15,

  /** Create a Stripe Connect Express account for a creator */
  createAccount: async (email: string): Promise<Stripe.Account> => {
    const stripe = getStripe();
    const account = await stripe.accounts.create({
      type: "express",
      email,
      capabilities: { transfers: { requested: true } },
    });
    logger.info(`[stripe-connect] Created Express account ${account.id} for ${email}`);
    return account;
  },

  /** Generate an onboarding link for the creator to complete Stripe Connect setup */
  getAccountLink: async (
    accountId: string,
    refreshUrl: string,
    returnUrl: string,
  ): Promise<string> => {
    const stripe = getStripe();
    const link = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: refreshUrl,
      return_url: returnUrl,
      type: "account_onboarding",
    });
    return link.url;
  },

  /** Retrieve the login link for an existing Express account */
  getLoginLink: async (accountId: string): Promise<string> => {
    const stripe = getStripe();
    const link = await stripe.accounts.createLoginLink(accountId);
    return link.url;
  },

  /** Retrieve account details */
  getAccount: async (accountId: string): Promise<Stripe.Account> => {
    const stripe = getStripe();
    return stripe.accounts.retrieve(accountId);
  },

  /**
   * Calculate commission and net amounts for a given gross amount in cents.
   * Signhify keeps `appFeePercent`, creator gets the rest.
   */
  splitAmount: (grossCents: number) => {
    const fee = Math.round(grossCents * (STRIPE_CONNECT.appFeePercent / 100));
    return {
      commissionCents: fee,
      netCents: grossCents - fee,
    };
  },
};

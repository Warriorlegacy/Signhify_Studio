/**
 * One-off credit top-up packs. Prices are benchmarked against comparable
 * AI build platforms (~$0.40/credit at entry, dropping to ~$0.25 at volume).
 * Client-safe: the catalogue is also rendered on the pricing page. The
 * charged amount is always re-read from here on the server.
 */
export const CREDIT_PACKS = {
  spark: { name: "Spark", credits: 25, cents: 1000, blurb: "Top up a busy week" },
  surge: { name: "Surge", credits: 60, cents: 2000, blurb: "Most popular top-up" },
  fleet: { name: "Fleet", credits: 150, cents: 4500, blurb: "Ship a full product" },
  vault: { name: "Vault", credits: 400, cents: 10000, blurb: "Best value per credit" },
} as const;

export type CreditPackId = keyof typeof CREDIT_PACKS;

export const CREDIT_PACK_LIST = (Object.keys(CREDIT_PACKS) as CreditPackId[]).map((id) => ({
  id,
  ...CREDIT_PACKS[id],
  perCredit: CREDIT_PACKS[id].cents / 100 / CREDIT_PACKS[id].credits,
}));

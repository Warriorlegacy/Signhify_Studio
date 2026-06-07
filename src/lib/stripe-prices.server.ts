export const STRIPE_PRICE_IDS = {
  studioMonthly: process.env.STRIPE_STUDIO_PRICE_ID || "price_test_signhify_studio_monthly",
  scaleMonthly: process.env.STRIPE_SCALE_PRICE_ID || "price_test_signhify_scale_monthly",
  creditPack: process.env.STRIPE_CREDIT_PACK_PRICE_ID || "price_test_signhify_credit_pack",
};

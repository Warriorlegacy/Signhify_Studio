import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import logger from "./logger";

export const createPortalSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    try {
      const key = process.env.STRIPE_SECRET_KEY;
      if (!key) {
        logger.error("Missing STRIPE_SECRET_KEY.");
        throw new Error("Missing STRIPE_SECRET_KEY.");
      }
      const { SITE_URL: site } = await import("@/lib/site-url");
      const email = (context as any)?.claims?.email;
      logger.info(`Fetching Stripe customer for email: ${email}`);
      const customers = await fetch(
        `https://api.stripe.com/v1/customers?email=${encodeURIComponent(email ?? "")}&limit=1`,
        { headers: { authorization: `Bearer ${key}` } },
      ).then((r) => r.json());
      let customer = customers?.data?.[0]?.id;
      if (!customer) {
        logger.info(`No existing Stripe customer found for email: ${email}. Creating new one.`);
        const body = new URLSearchParams();
        if (email) body.set("email", email);
        const created = await fetch("https://api.stripe.com/v1/customers", {
          method: "POST",
          headers: {
            authorization: `Bearer ${key}`,
            "content-type": "application/x-www-form-urlencoded",
          },
          body,
        }).then((r) => r.json());
        customer = created.id;
        logger.info(`Created new Stripe customer: ${customer}`);
      }
      const body = new URLSearchParams();
      body.set("customer", customer);
      body.set("return_url", `${site}/app/settings`);
      const session = await fetch("https://api.stripe.com/v1/billing_portal/sessions", {
        method: "POST",
        headers: {
          authorization: `Bearer ${key}`,
          "content-type": "application/x-www-form-urlencoded",
        },
        body,
      }).then((r) => r.json());
      logger.info(`Created billing portal session for customer: ${customer}`);
      return { url: session.url as string };
    } catch (error) {
      logger.error(`Failed to create portal session: ${error}`);
      throw error;
    }
  });

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
      const { supabase, userId } = context;

      const { data: profile } = await (supabase as any)
        .from("profiles")
        .select("stripe_customer_id")
        .eq("id", userId)
        .maybeSingle();

      let customerId = profile?.stripe_customer_id;
      if (!customerId) {
        const { data: userRes } = await supabase.auth.getUser();
        const email = userRes?.user?.email;
        const created = await fetch("https://api.stripe.com/v1/customers", {
          method: "POST",
          headers: {
            authorization: `Bearer ${key}`,
            "content-type": "application/x-www-form-urlencoded",
          },
          body: email ? new URLSearchParams({ email }) : undefined,
        }).then((r) => r.json());
        customerId = created.id;
        await (supabase as any)
          .from("profiles")
          .update({ stripe_customer_id: customerId } as any)
          .eq("id", userId);
      }

      const body = new URLSearchParams();
      body.set("customer", customerId);
      body.set("return_url", `${site}/app/billing`);
      const session = await fetch("https://api.stripe.com/v1/billing_portal/sessions", {
        method: "POST",
        headers: {
          authorization: `Bearer ${key}`,
          "content-type": "application/x-www-form-urlencoded",
        },
        body,
      }).then((r) => r.json());

      logger.info(`Created billing portal session for customer: ${customerId}`);
      return { url: session.url as string };
    } catch (error) {
      logger.error(`Failed to create portal session: ${error}`);
      throw error;
    }
  });

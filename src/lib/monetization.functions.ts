import { createServerFn } from "@tanstack/react-start";
import Stripe from "stripe";

export const getUserCredits = createServerFn({ method: "GET" })
  .handler(async () => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    
    // In a real implementation we would fetch the user ID from auth context.
    // For this mock, we'll return a static shape or fetch the first user.
    return {
      tier: "free",
      creditsRemaining: 2,
      maxCredits: 2,
      projectsCount: 1,
      videosGenerated: 0
    };
  });

export const createCheckoutSession = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const obj = input as Record<string, unknown>;
    const plan = typeof obj?.plan === "string" ? obj.plan : "pro";
    return { plan };
  })
  .handler(async ({ data }) => {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    
    if (!stripeKey) {
      return { 
        success: true,
        url: "https://checkout.stripe.com/c/pay/mock_session_id" 
      };
    }
    
    try {
      const stripe = new Stripe(stripeKey);
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "Scroll Studio Pro",
                description: "Unlimited AI scroll generation",
              },
              unit_amount: 4900,
              recurring: { interval: "month" },
            },
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/scroll-studio?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/scroll-studio?canceled=true`,
      });

      return { success: true, url: session.url };
    } catch (err) {
      console.error("Stripe error:", err);
      throw new Error("Failed to create Stripe session.");
    }
  });

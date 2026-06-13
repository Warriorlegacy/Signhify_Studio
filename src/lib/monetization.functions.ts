import { createServerFn } from "@tanstack/react-start";
import Stripe from "stripe";

export const getUserCredits = createServerFn({ method: "GET" })
  .handler(async ({ context }) => {
    // Require authentication
    if (!context.userId) throw new Error("Unauthorized");

    const { supabase } = await import("@/integrations/supabase/client");

    // Fetch user credits from the database
    const { data: creditsData, error } = await supabase
      .from("user_credits")
      .select("tier, credits_remaining, max_credits, projects_count, videos_generated")
      .eq("user_id", context.userId)
      .single();

    if (error) {
      // If no record found, return default free tier values
      return {
        tier: "free",
        creditsRemaining: 2,
        maxCredits: 2,
        projectsCount: 0,
        videosGenerated: 0
      };
    }

    return {
      tier: creditsData.tier,
      creditsRemaining: creditsData.credits_remaining,
      maxCredits: creditsData.max_credits,
      projectsCount: creditsData.projects_count,
      videosGenerated: creditsData.videos_generated
    };
  });

export const createCheckoutSession = createServerFn({ method: "POST" })
  .handler(async ({ context, data }) => {
    // Require authentication
    if (!context.userId) throw new Error("Unauthorized");

    const { plan } = data;
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
        // Add metadata to link the session to the user
        metadata: {
          user_id: context.userId,
          plan: plan
        }
      });

      return { success: true, url: session.url };
    } catch (err) {
      console.error("Stripe error:", err);
      throw new Error("Failed to create Stripe session.");
    }
  });
